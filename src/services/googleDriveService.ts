import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { DriveFileItem, DriveStorageQuota } from '../types/googleDrive';

// Scopes requested for Google Drive integration
export const GOOGLE_DRIVE_SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.activity',
  'https://www.googleapis.com/auth/drive.activity.readonly',
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.apps.readonly',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.install',
  'https://www.googleapis.com/auth/drive.meet.readonly',
  'https://www.googleapis.com/auth/drive.metadata',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.photos.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.scripts',
];

// Initialize Firebase App safely (singleton pattern)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Provider with Drive scopes
const provider = new GoogleAuthProvider();
GOOGLE_DRIVE_SCOPES.forEach((scope) => provider.addScope(scope));

// In-memory access token cache (MANDATORY: never store in localStorage / sessionStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

/**
 * Initialize auth listener on app boot
 */
export const initDriveAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Token not cached yet or expired
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Sign in with Google using popup and capture access token
 */
export const signInWithGoogleDrive = async (): Promise<{
  user: User;
  accessToken: string;
} | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);

    if (!credential?.accessToken) {
      throw new Error('Không thể trích xuất mã truy cập Google Drive từ Firebase Auth');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Lỗi đăng nhập Google Drive:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Retrieve cached token in-memory
 */
export const getDriveAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

/**
 * Log out and purge in-memory token
 */
export const logoutGoogleDrive = async (): Promise<void> => {
  await signOut(auth);
  cachedAccessToken = null;
};

/* =========================================================================
   GOOGLE DRIVE REST API UTILITIES
   ========================================================================= */

const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3';

/**
 * Get or create dedicated VeraFense evidence folder
 */
export const getOrCreateEvidenceFolder = async (
  folderName = 'VeraFense_HoSo_ToGiac'
): Promise<string> => {
  const token = cachedAccessToken;
  if (!token) throw new Error('Chưa kết nối tài khoản Google Drive');

  // Search if folder exists
  const query = encodeURIComponent(
    `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
  );
  const searchRes = await fetch(`${DRIVE_API_URL}/files?q=${query}&fields=files(id,name)`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!searchRes.ok) {
    const err = await searchRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Không thể kiểm tra thư mục Google Drive');
  }

  const searchData = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }

  // Create folder if not found
  const createRes = await fetch(`${DRIVE_API_URL}/files`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      description: 'Thư mục lưu trữ hồ sơ tố giác tội phạm và bằng chứng số bảo vệ bởi VeraFense',
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Không thể tạo thư mục lưu trữ trên Google Drive');
  }

  const newFolder = await createRes.json();
  return newFolder.id;
};

/**
 * Upload a text or json fraud dossier to Google Drive
 */
export const uploadDossierToDrive = async (
  title: string,
  content: string,
  options?: {
    mimeType?: string;
    description?: string;
    folderId?: string;
  }
): Promise<DriveFileItem> => {
  const token = cachedAccessToken;
  if (!token) throw new Error('Vui lòng kết nối Google Drive trước khi lưu hồ sơ');

  const folderId = options?.folderId || (await getOrCreateEvidenceFolder());
  const mimeType = options?.mimeType || 'text/plain;charset=utf-8';

  const metadata = {
    name: title,
    mimeType: options?.mimeType || 'text/plain',
    parents: [folderId],
    description:
      options?.description ||
      'Hồ sơ điều tra & bằng chứng tố giác lừa đảo được niêm phong bảo vệ bởi VeraFense',
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelim = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${mimeType}\r\n\r\n` +
    content +
    closeDelim;

  const res = await fetch(
    `${DRIVE_UPLOAD_URL}/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,createdTime,size`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Lỗi tải tệp lên Google Drive');
  }

  return await res.json();
};

/**
 * List files stored in the VeraFense folder or general Drive
 */
export const listDriveFiles = async (folderId?: string): Promise<DriveFileItem[]> => {
  const token = cachedAccessToken;
  if (!token) throw new Error('Chưa kết nối Google Drive');

  let query = 'trashed = false';
  if (folderId) {
    query += ` and '${folderId}' in parents`;
  } else {
    // Look in evidence folder if exists
    try {
      const targetFolderId = await getOrCreateEvidenceFolder();
      query += ` and '${targetFolderId}' in parents`;
    } catch {
      // fallback to files with VeraFense in name
      query += ` and name contains 'VeraFense'`;
    }
  }

  const fields =
    'files(id,name,mimeType,webViewLink,webContentLink,createdTime,modifiedTime,size,iconLink,description)';
  const res = await fetch(
    `${DRIVE_API_URL}/files?q=${encodeURIComponent(query)}&orderBy=createdTime desc&pageSize=50&fields=${fields}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Không thể tải danh sách tệp từ Google Drive');
  }

  const data = await res.json();
  return data.files || [];
};

/**
 * Delete a file on Google Drive
 * Note: Must always be called after explicit confirmation dialog
 */
export const deleteDriveFile = async (fileId: string): Promise<boolean> => {
  const token = cachedAccessToken;
  if (!token) throw new Error('Chưa kết nối Google Drive');

  const res = await fetch(`${DRIVE_API_URL}/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Lỗi khi xóa tệp trên Google Drive');
  }

  return true;
};

/**
 * Fetch storage quota from Drive About API
 */
export const getDriveStorageQuota = async (): Promise<DriveStorageQuota | null> => {
  const token = cachedAccessToken;
  if (!token) return null;

  try {
    const res = await fetch(`${DRIVE_API_URL}/about?fields=storageQuota`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.storageQuota || null;
  } catch {
    return null;
  }
};
