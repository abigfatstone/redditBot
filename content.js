function createCommentButton() {
  const posts = document.querySelectorAll('.Post');
  
  posts.forEach(post => {
    if (!post.querySelector('.ai-comment-btn')) {
      const buttonContainer = document.createElement('div');
      buttonContainer.innerHTML = `
        <button class="ai-comment-btn">生成搞笑评论</button>
      `;
      
      const commentSection = post.querySelector('.commentarea');
      if (commentSection) {
        commentSection.prepend(buttonContainer);
      }
      
      buttonContainer.querySelector('.ai-comment-btn').addEventListener('click', async () => {
        const postTitle = post.querySelector('h1')?.textContent || '';
        const postContent = post.querySelector('[data-click-id="text"]')?.textContent || '';
        
        try {
          const response = await generateComment(postTitle, postContent);
          const commentBox = post.querySelector('textarea[name="text"]');
          if (commentBox) {
            commentBox.value = response;
          }
        } catch (error) {
          console.error('生成评论失败:', error);
          alert('生成评论失败，请检查 API key 是否正确设置');
        }
      });
    }
  });
}

async function generateComment(title, content) {
  const apiKey = await chrome.storage.local.get('apiKey');
  
  if (!apiKey.apiKey) {
    throw new Error('请先设置 OpenAI API Key');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey.apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'system',
        content: '你是一个诙谐幽默的评论者，要用轻松调侃的语气写评论。评论要简短有趣，带点调侃但不能太过分。'
      }, {
        role: 'user',
        content: `请针对这个帖子写一个有趣的评论。标题：${title}，内容：${content}`
      }]
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

// 监听页面变化，动态添加按钮
const observer = new MutationObserver(createCommentButton);
observer.observe(document.body, { childList: true, subtree: true });

// 初始化时添加按钮
createCommentButton(); 