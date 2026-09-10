import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import {
  initDriveAuth,
  signInWithGoogleDrive,
  logoutGoogleDrive,
  getDriveAccessToken,
  uploadDossierToDrive,
  listDriveFiles,
  deleteDriveFile,
  getDriveStorageQuota,
} from '../services/googleDriveService';
import { DriveFileItem, DriveStorageQuota } from '../types/googleDrive';

interface GoogleDriveContextType {
  user: User | null;
  accessToken: string | null;
  isConnected: boolean;
  isLoading: boolean;
  isSyncing: boolean;
  files: DriveFileItem[];
  quota: DriveStorageQuota | null;
  signInWithDrive: () => Promise<boolean>;
  signOutDrive: () => Promise<void>;
  saveDossier: (fileName: string, content: string) => Promise<DriveFileItem | null>;
  deleteFileWithConfirm: (fileId: string, fileName: string) => Promise<boolean>;
  refreshFiles: () => Promise<void>;
}

const GoogleDriveContext = createContext<GoogleDriveContextType | undefined>(undefined);

export const GoogleDriveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [quota, setQuota] = useState<DriveStorageQuota | null>(null);

  const isConnected = !!accessToken && !!user;

  const refreshFiles = useCallback(async () => {
    if (!accessToken) return;
    try {
      setIsSyncing(true);
      const [driveFiles, driveQuota] = await Promise.all([
        listDriveFiles(),
        getDriveStorageQuota(),
      ]);
      setFiles(driveFiles);
      setQuota(driveQuota);
    } catch (err) {
      console.error('Lỗi khi làm mới danh sách Google Drive:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [accessToken]);

  // Auth state listener on boot
  useEffect(() => {
    const unsubscribe = initDriveAuth(
      async (u, token) => {
        setUser(u);
        setAccessToken(token);
        setIsLoading(false);
      },
      () => {
        setUser(null);
        setAccessToken(null);
        setFiles([]);
        setQuota(null);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // When token arrives, fetch files
  useEffect(() => {
    if (accessToken) {
      refreshFiles();
    }
  }, [accessToken, refreshFiles]);

  const signInWithDrive = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const res = await signInWithGoogleDrive();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Sign in Google Drive error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOutDrive = async () => {
    try {
      await logoutGoogleDrive();
      setUser(null);
      setAccessToken(null);
      setFiles([]);
      setQuota(null);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const saveDossier = async (
    fileName: string,
    content: string
  ): Promise<DriveFileItem | null> => {
    if (!accessToken) {
      const ok = await signInWithDrive();
      if (!ok) return null;
    }

    try {
      setIsSyncing(true);
      const saved = await uploadDossierToDrive(fileName, content);
      await refreshFiles();
      return saved;
    } catch (err: any) {
      console.error('Lưu tệp thất bại:', err);
      throw err;
    } finally {
      setIsSyncing(false);
    }
  };

  /**
   * Delete a file with mandatory explicit user confirmation dialog
   */
  const deleteFileWithConfirm = async (fileId: string, fileName: string): Promise<boolean> => {
    const confirmed = window.confirm(
      `Xác nhận xóa tài liệu khỏi Google Drive?\n\nTên tệp: "${fileName}"\n\nHành động này sẽ xóa chứng cứ khỏi bộ nhớ đám mây của bạn và không thể hoàn tác.`
    );
    if (!confirmed) return false;

    try {
      setIsSyncing(true);
      const ok = await deleteDriveFile(fileId);
      if (ok) {
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
      }
      return ok;
    } catch (err) {
      console.error('Xóa tệp Google Drive thất bại:', err);
      throw err;
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <GoogleDriveContext.Provider
      value={{
        user,
        accessToken,
        isConnected,
        isLoading,
        isSyncing,
        files,
        quota,
        signInWithDrive,
        signOutDrive,
        saveDossier,
        deleteFileWithConfirm,
        refreshFiles,
      }}
    >
      {children}
    </GoogleDriveContext.Provider>
  );
};

export const useGoogleDrive = () => {
  const context = useContext(GoogleDriveContext);
  if (!context) {
    throw new Error('useGoogleDrive must be used within GoogleDriveProvider');
  }
  return context;
};
