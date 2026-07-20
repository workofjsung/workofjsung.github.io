const galleryFirebaseConfig = {
  apiKey: "AIzaSyBHrAvfSNS8pet9sy1afcl6waMvs4YPecE",
  authDomain: "workofjsung.firebaseapp.com",
  databaseURL: "https://workofjsung-default-rtdb.firebaseio.com",
  projectId: "workofjsung",
  storageBucket: "workofjsung.firebasestorage.app",
  messagingSenderId: "154766994690",
  appId: "1:154766994690:web:cd0429e2cfd7821deca61b"
};

firebase.initializeApp(galleryFirebaseConfig);
const imagesRef = firebase.database().ref('images');

function showGalleryError(label, err) {
  console.error(label, err);
  let banner = document.getElementById('firebase-error-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'firebase-error-banner';
    banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#fee2e2;color:#991b1b;' +
      'font-family:monospace;font-size:12px;padding:10px;white-space:pre-wrap;word-break:break-word;' +
      'z-index:9999;border-top:2px solid #991b1b;max-height:40vh;overflow:auto;';
    document.body.appendChild(banner);
  }
  banner.textContent = `${label}: ${err && err.message ? err.message : err}`;
}

function resizeImageFile(file, maxDim, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round(height * (maxDim / width));
            width = maxDim;
          } else {
            width = Math.round(width * (maxDim / height));
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function addImage(dataUrl) {
  imagesRef.push({ dataUrl, createdAt: Date.now() })
    .catch((err) => showGalleryError('addImage failed', err));
}

function removeImage(id) {
  imagesRef.child(id).remove()
    .catch((err) => showGalleryError('removeImage failed', err));
}

function subscribeImages(callback) {
  imagesRef.on('value', (snapshot) => {
    const val = snapshot.val() || {};
    const images = Object.entries(val).map(([id, data]) => ({ id, ...data }));
    callback(images);
  }, (err) => showGalleryError('subscribeImages failed', err));
}
