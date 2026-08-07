// shared/utils/images.js — compressão e upload de imagem, genéricos.
//
// Mesma lógica do compressImage()/uploadImageFile() do firebase.js atual
// do CCBMG — nenhuma referência a nenhum tenant, sempre foi genérico.

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

/**
 * Comprime uma imagem no browser via <canvas>, reduzindo a qualidade JPEG
 * iterativamente até atingir o tamanho-alvo (ou a qualidade mínima).
 * @param {File} file
 * @param {{maxWidth?: number, maxHeight?: number, targetKB?: number, initialQuality?: number, minQuality?: number, step?: number}} [opts]
 * @returns {Promise<File>}
 */
export async function compressImage(file, opts = {}) {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    targetKB = 200,
    initialQuality = 0.8,
    minQuality = 0.5,
    step = 0.1,
  } = opts;

  const img = await loadImage(file);
  const { width, height } = fitWithin(img.width, img.height, maxWidth, maxHeight);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, height);

  let quality = initialQuality;
  let blob = await canvasToBlob(canvas, quality);

  while (blob.size / 1024 > targetKB && quality - step >= minQuality) {
    quality -= step;
    blob = await canvasToBlob(canvas, quality);
  }

  return new File([blob], file.name, { type: "image/jpeg", lastModified: Date.now() });
}

/**
 * Comprime (opcional) e envia ao Storage com nome único, validando limite
 * de tamanho e aplicando cache longo (1 ano) — mesmo padrão de hoje.
 * @param {object} storage — instância de Storage (de initTenantFirebase).
 * @param {File} file
 * @param {string} pathBase — prefixo do path no Storage (ex.: "tenants/org_bonfim/cms/banners").
 * @param {(pct: number) => void} [onProgress]
 * @param {{compress?: boolean, autoCompress?: boolean, maxSizeMB?: number, maxWidth?: number, maxHeight?: number, targetKB?: number}} [opts]
 *   `autoCompress` é alias de `compress` (nome usado pelo firebase.js do CCBMG); `maxWidth`/`maxHeight`/`targetKB`
 *   são repassados direto para `compressImage()` quando informados.
 * @returns {Promise<{url: string, path: string}>}
 */
export function createImageUploader(storage) {
  return async function uploadImageFile(file, pathBase, onProgress, opts = {}) {
    const { compress, autoCompress, maxSizeMB = 5, maxWidth, maxHeight, targetKB } = opts;
    const shouldCompress = autoCompress ?? compress ?? true;

    if (file.size > maxSizeMB * 1024 * 1024) {
      throw new Error(`Arquivo maior que ${maxSizeMB}MB.`);
    }

    const compressOpts = {};
    if (maxWidth !== undefined) compressOpts.maxWidth = maxWidth;
    if (maxHeight !== undefined) compressOpts.maxHeight = maxHeight;
    if (targetKB !== undefined) compressOpts.targetKB = targetKB;

    const toUpload = shouldCompress ? await compressImage(file, compressOpts) : file;
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${pathBase}/${Date.now()}.${ext}`;
    const storageRef = ref(storage, path);

    const task = uploadBytesResumable(storageRef, toUpload, {
      cacheControl: "public,max-age=31536000",
      contentType: toUpload.type || "image/jpeg",
    });

    await new Promise((resolve, reject) => {
      task.on(
        "state_changed",
        (snap) => {
          if (typeof onProgress === "function") {
            onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
          }
        },
        reject,
        resolve
      );
    });

    const url = await getDownloadURL(storageRef);
    return { url, path };
  };
}

// ---- helpers internos ----

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function fitWithin(w, h, maxW, maxH) {
  const ratio = Math.min(maxW / w, maxH / h, 1);
  return { width: Math.round(w * ratio), height: Math.round(h * ratio) };
}

function canvasToBlob(canvas, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}
