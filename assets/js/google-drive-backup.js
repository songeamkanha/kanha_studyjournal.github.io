// Google Drive Backup & Restore functionality
// Also handles manual download/upload

const BackupManager = {
  // Manual backup - Download JSON file
  downloadBackup() {
    try {
      const data = DataManager.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `website-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Error downloading backup:', error);
      alert('Error downloading backup: ' + error.message);
      return false;
    }
  },

  // Manual restore - Upload JSON file
  uploadBackup(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (this.validateBackupData(data)) {
            DataManager.importData(data);
            resolve(true);
          } else {
            reject(new Error('Invalid backup file format'));
          }
        } catch (error) {
          reject(new Error('Error reading backup file: ' + error.message));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  },

  // Validate backup data structure
  validateBackupData(data) {
    return data && (
      Array.isArray(data.blogPosts) ||
      Array.isArray(data.portfolio) ||
      data.background
    );
  },

};

// Global functions for button onclick handlers
function downloadBackup() {
  const success = BackupManager.downloadBackup();
  if (success && typeof showSuccessMessage === 'function') {
    showSuccessMessage('Backup downloaded successfully! Upload it to Google Drive for cloud backup.');
  } else if (success) {
    alert('Backup downloaded successfully! Upload it to Google Drive for cloud backup.');
  }
}

function uploadBackup() {
  document.getElementById('backup-file-input').click();
}

function showBackupInfo() {
  const infoHTML = `
    <div style="max-width: 600px; padding: 1rem;">
      <h2 style="margin-top: 0; color: var(--primary-color);">
        <i class="fas fa-cloud"></i> Backup & Restore Guide
      </h2>
      
      <h3 style="margin-top: 1.5rem;">Current Storage</h3>
      <ul style="line-height: 1.8;">
        <li>Your data is stored in browser LocalStorage (fast & works offline)</li>
        <li>Data persists until you clear browser data</li>
      </ul>
      
      <h3 style="margin-top: 1.5rem;">Backup Options</h3>
      
      <h4>1. Download Backup (Recommended)</h4>
      <ul style="line-height: 1.8;">
        <li>Click "Download Backup" to save a JSON file</li>
        <li>Upload this file to Google Drive manually for cloud backup</li>
        <li>Save the file in multiple locations for safety</li>
      </ul>
      
      <h4>2. Upload & Restore</h4>
      <ul style="line-height: 1.8;">
        <li>Use "Upload & Restore" to restore from a backup file</li>
        <li>This replaces all current data with backup data</li>
      </ul>
      
      <h3 style="margin-top: 1.5rem;">Google Drive Integration</h3>
      <ul style="line-height: 1.8;">
        <li>Download your backup file</li>
        <li>Go to <a href="https://drive.google.com" target="_blank">drive.google.com</a></li>
        <li>Upload the JSON file to your Drive</li>
        <li>Organize it in a "Website Backups" folder</li>
        <li>Set up automatic syncing if you use Google Drive Desktop</li>
      </ul>
      
      <h3 style="margin-top: 1.5rem;">Best Practices</h3>
      <ul style="line-height: 1.8;">
        <li>✓ Backup regularly (weekly or after major changes)</li>
        <li>✓ Keep multiple backup copies</li>
        <li>✓ Store backups in Google Drive for cloud safety</li>
        <li>✓ Name backups with dates: website-backup-2024-01-15.json</li>
      </ul>
      
      <p style="margin-top: 1.5rem; padding: 1rem; background: var(--light-background); border-radius: 6px;">
        <strong>Note:</strong> All content (blog posts, portfolio, background info) is included in one backup file.
      </p>
    </div>
  `;
  
  // Create modal for better display
  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.style.display = 'flex';
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 700px;">
      <div class="modal-header">
        <h2>Backup Information</h2>
        <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
      </div>
      ${infoHTML}
      <div style="padding: 1rem 2rem 2rem; text-align: right;">
        <button class="btn primary" onclick="this.closest('.modal').remove()">Got it!</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  
  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// Handle file input change
document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('backup-file-input');
  if (fileInput) {
    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (confirm('This will replace all your current data with the backup file. Continue?')) {
        try {
          await BackupManager.uploadBackup(file);
          if (typeof showSuccessMessage === 'function') {
            showSuccessMessage('Backup restored successfully! Refreshing page...');
          } else {
            alert('Backup restored successfully! Refreshing page...');
          }
          setTimeout(() => location.reload(), 1500);
        } catch (error) {
          alert('Error restoring backup: ' + error.message);
        }
      }
      fileInput.value = ''; // Reset input
    });
  }
});

