document.getElementById('save').addEventListener('click', () => {
  const apiKey = document.getElementById('apiKey').value;
  chrome.storage.local.set({ apiKey }, () => {
    alert('API Key 已保存！');
  });
});

// 加载已保存的 API Key
chrome.storage.local.get('apiKey', (data) => {
  if (data.apiKey) {
    document.getElementById('apiKey').value = data.apiKey;
  }
}); 