import { useRef } from 'react';
import { Document } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Upload, Download, Trash2, FileText, FileImage, File } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentListProps {
  documents: Document[];
  readonly?: boolean;
  onUpload: (file: File) => void;
  onDelete: (docId: string) => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return FileImage;
  if (type.includes('pdf') || type.includes('document') || type.includes('text')) return FileText;
  return File;
};

export function DocumentList({ documents, readonly = false, onUpload, onDelete }: DocumentListProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      e.target.value = '';
    }
  };

  const handleDownload = (doc: Document) => {
    // Decode base64 and create blob
    const byteCharacters = atob(doc.content);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: doc.type });
    
    // Create download link with Chinese filename support
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">文档附件</span>
        {!readonly && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="h-7 text-xs"
          >
            <Upload className="h-3 w-3 mr-1" />
            上传
          </Button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {documents.length === 0 ? (
        <p className="text-xs text-muted-foreground py-2">暂无文档</p>
      ) : (
        <div className="space-y-1">
          {documents.map((doc) => {
            const FileIcon = getFileIcon(doc.type);
            return (
              <div
                key={doc.id}
                className={cn(
                  'flex items-center gap-2 rounded-md border bg-muted/30 p-2',
                  'group hover:bg-muted/50 transition-colors'
                )}
              >
                <FileIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate" title={doc.name}>
                    {doc.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(doc.size)}
                  </p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleDownload(doc)}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                  {!readonly && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive hover:text-destructive"
                      onClick={() => onDelete(doc.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
