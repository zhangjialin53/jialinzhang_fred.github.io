let currentPDF = null;
let currentPage = 1;
let scale = 1.5;

window.loadPDF = async function(pdfPath) {
const viewer = document.getElementById('pdfViewer');
const loadingDiv = document.createElement('div');
loadingDiv.className = 'loading';
loadingDiv.textContent = '加载中...';
viewer.insertBefore(loadingDiv, viewer.firstChild);
const canvas = document.getElementById('pdfCanvas');
canvas.style.display = 'none';
canvas.style.width = '100%';
canvas.style.height = 'auto';
  
  try {
    const loadingTask = pdfjsLib.getDocument({ url: pdfPath });
    currentPDF = await loadingTask.promise;
    currentPage = 1;
    
    // 使用外部canvas变量
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 初始化渲染
    renderPage(currentPage);
    // 保留现有canvas结构
    document.querySelector('.loading').remove();
    canvas.style.display = 'block';
    canvas.style.opacity = '0';
    setTimeout(() => canvas.style.opacity = '1', 300);
      } catch (err) {
        console.error('PDF加载失败:', err);
        const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.innerHTML = `PDF加载失败: ${err.message}<br>请检查文件路径：${pdfPath}`;
    document.getElementById('pdfViewer').appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
      }
}

async function renderPage(pageNum) {
  const page = await currentPDF.getPage(pageNum);
  const viewport = page.getViewport({ scale: scale });
  const canvas = document.getElementById('pdfCanvas');
  const context = canvas.getContext('2d');

  canvas.height = viewport.height;
  canvas.width = viewport.width;

  const renderContext = {
    canvasContext: context,
    viewport: viewport
  };

  await page.render(renderContext).promise;
}

// 初始化加载默认PDF
document.addEventListener('DOMContentLoaded', () => {
  window.loadPDF('cv-en.pdf');
});

// 窗口尺寸变化时适配
window.addEventListener('resize', () => {
  if (currentPDF) {
    renderPage(currentPage);
  }
});