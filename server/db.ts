import fs from 'fs';
import path from 'path';
import initSqlJs, { Database, SqlValue } from 'sql.js';
import crypto from 'crypto';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'deal.sqlite');

export const OWNER_EMAIL = (process.env.OWNER_EMAIL || 'dd3.99d@gmail.com').toLowerCase().trim();

let db: Database | null = null;

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Persist SQLite database to disk
export function saveDatabase(): void {
  if (!db) return;
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE, buffer);
  } catch (err) {
    console.error('Failed to persist database to disk:', err);
  }
}

// Initialize database & tables
export async function getDatabase(): Promise<Database> {
  if (db) return db;

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_FILE)) {
    try {
      const fileBuffer = fs.readFileSync(DB_FILE);
      db = new SQL.Database(fileBuffer);
      console.log('Loaded persistent DEAL SQLite database from', DB_FILE);
    } catch (e) {
      console.warn('Error reading existing DB file, creating fresh database:', e);
      db = new SQL.Database();
    }
  } else {
    db = new SQL.Database();
    console.log('Created fresh DEAL SQLite database at', DB_FILE);
  }

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'engineer',
      is_verified INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS roles (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      token TEXT UNIQUE NOT NULL,
      user_id TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS email_verification_tokens (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      code TEXT NOT NULL,
      token_hash TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      used_at TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      code TEXT NOT NULL,
      token_hash TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      used_at TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      client_name TEXT NOT NULL,
      project_type TEXT NOT NULL,
      location TEXT NOT NULL,
      land_area REAL NOT NULL,
      building_type TEXT NOT NULL,
      floors INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'in_progress',
      data_json TEXT NOT NULL,
      is_demo INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS project_versions (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      version_name TEXT NOT NULL,
      author_id TEXT,
      author_name TEXT NOT NULL,
      description TEXT,
      data_json TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS project_comments (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      user_id TEXT,
      author_name TEXT NOT NULL,
      comment_text TEXT NOT NULL,
      area_ref TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS project_files (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      file_name TEXT NOT NULL,
      file_type TEXT NOT NULL,
      file_url TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS client_reviews (
      id TEXT PRIMARY KEY,
      project_id TEXT,
      client_name TEXT NOT NULL,
      client_email TEXT,
      rating INTEGER NOT NULL,
      review_text TEXT NOT NULL,
      is_public INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contact_inquiries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      category TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'unread',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS platform_content (
      content_key TEXT NOT NULL,
      lang TEXT NOT NULL,
      content TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (content_key, lang)
    );

    CREATE TABLE IF NOT EXISTS platform_settings (
      setting_key TEXT PRIMARY KEY,
      value_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS marketing_consents (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      opted_in INTEGER NOT NULL,
      ip_address TEXT,
      consented_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      action TEXT NOT NULL,
      details TEXT NOT NULL,
      ip_address TEXT,
      created_at TEXT NOT NULL
    );
  `);

  // Seed default roles if empty
  const rolesCheck = db.exec("SELECT COUNT(*) FROM roles");
  if (rolesCheck[0]?.values[0]?.[0] === 0) {
    db.run(`
      INSERT INTO roles (id, name, description, created_at) VALUES
      ('role-owner', 'Owner', 'Complete system & architectural platform administration', datetime('now')),
      ('role-engineer', 'Engineer', 'Architectural & civil engineering design workspace access', datetime('now')),
      ('role-architect', 'Architect', 'Lead design and 3D modeling access', datetime('now')),
      ('role-designer', 'Designer', 'Interior, landscape and materials design access', datetime('now')),
      ('role-company', 'Company', 'Enterprise multi-project account', datetime('now')),
      ('role-client', 'Client', 'Read-only presentation and feedback review access', datetime('now'));
    `);
  }

  // Seed initial editable platform content if empty
  const contentCheck = db.exec("SELECT COUNT(*) FROM platform_content");
  if (contentCheck[0]?.values[0]?.[0] === 0) {
    const defaultContents = [
      { key: 'brand_name', en: 'DEAL', ar: 'ديل DEAL' },
      { key: 'brand_tagline', en: 'Design • Engineering • Architecture • Living', ar: 'تصميم • هندسة • عمارة • حياة' },
      { key: 'hero_title', en: 'AI-Powered Architectural Engineering Platform', ar: 'المنصة الهندسية والمعمارية الذكية المدعومة بالذكاء الاصطناعي' },
      { key: 'hero_subtitle', en: 'Transforming ideas, sketches, floor plans, site surveys, voice notes, and hand gestures into realistic interactive 3D architecture.', ar: 'تحويل الأفكار والرسومات اليدوية ومخططات الأراضي والأوامر الصوتية إلى واقع معماري تفاعلي ثلاثي الأبعاد.' },
      { key: 'vision_2030_text', en: 'Aligned with Saudi Vision 2030 for sustainable urban innovation, smart architectural planning, and green living environments.', ar: 'متوافق مع مستهدفات رؤية السعودية 2030 في الابتكار الحضري المستدام، والتخطيط المعماري الذكي، والمباني الخضراء.' },
      { key: 'announcement', en: 'DEAL Architecture AI Engine v3.4 is live. Welcome to the official platform.', ar: 'محرك ديل المعماري الذكي الإصدار 3.4 متاح الآن. مرحباً بكم في المنصة الرسمية.' }
    ];

    const now = new Date().toISOString();
    for (const c of defaultContents) {
      db.run(
        "INSERT INTO platform_content (content_key, lang, content, updated_at) VALUES (?, ?, ?, ?)",
        [c.key, 'en', c.en, now]
      );
      db.run(
        "INSERT INTO platform_content (content_key, lang, content, updated_at) VALUES (?, ?, ?, ?)",
        [c.key, 'ar', c.ar, now]
      );
    }
  }

  // Seed default brand settings if empty
  const settingsCheck = db.exec("SELECT COUNT(*) FROM platform_settings");
  if (settingsCheck[0]?.values[0]?.[0] === 0) {
    const now = new Date().toISOString();
    db.run(
      "INSERT INTO platform_settings (setting_key, value_json, updated_at) VALUES (?, ?, ?)",
      [
        'branding',
        JSON.stringify({
          brandName: 'DEAL',
          tagline: 'Design • Engineering • Architecture • Living',
          primaryColor: '#54483C',
          bgColor: '#F6EFE5',
          cardBgColor: '#FAF7F2',
          accentColor: '#8A7A6A',
          contactEmail: 'dalia.alwaqtan@deal-architecture.com',
          headquarters: 'King Abdullah Financial District (KAFD), Riyadh, Saudi Arabia'
        }),
        now
      ]
    );
  }

  // Check if primary owner account exists, ensure role is 'owner' if verified
  promoteOwnerIfRegistered(db);

  saveDatabase();
  return db;
}

// Check and promote dd3.99d@gmail.com to owner if present
export function promoteOwnerIfRegistered(database: Database): void {
  try {
    const res = database.exec("SELECT id, role, is_verified FROM users WHERE LOWER(email) = ?", [OWNER_EMAIL]);
    if (res[0] && res[0].values.length > 0) {
      const user = res[0].values[0];
      const role = user[1] as string;
      const isVerified = user[2] as number;
      if (role !== 'owner' && isVerified === 1) {
        database.run("UPDATE users SET role = 'owner', updated_at = datetime('now') WHERE LOWER(email) = ?", [OWNER_EMAIL]);
        console.log(`[AUTH] Successfully promoted verified primary owner account: ${OWNER_EMAIL}`);
        saveDatabase();
      }
    }
  } catch (err) {
    console.error('Error checking owner status:', err);
  }
}

// ----------------- CRYPTOGRAPHIC HELPERS -----------------
export function hashPassword(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

export function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  try {
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    const hashBuffer = Buffer.from(hash, 'hex');
    const storedBuffer = Buffer.from(storedHash, 'hex');
    if (hashBuffer.length !== storedBuffer.length) return false;
    return crypto.timingSafeEqual(hashBuffer, storedBuffer);
  } catch (e) {
    return false;
  }
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function generateVerificationCode(): string {
  return crypto.randomInt(100000, 999999).toString();
}

// Helper to execute SQL queries and return typed object arrays
export function queryAll<T = any>(database: Database, sql: string, params: SqlValue[] = []): T[] {
  const res = database.exec(sql, params);
  if (!res || res.length === 0) return [];
  const columns = res[0].columns;
  return res[0].values.map(row => {
    const obj: any = {};
    columns.forEach((col, idx) => {
      obj[col] = row[idx];
    });
    return obj as T;
  });
}

export function queryOne<T = any>(database: Database, sql: string, params: SqlValue[] = []): T | null {
  const rows = queryAll<T>(database, sql, params);
  return rows.length > 0 ? rows[0] : null;
}
