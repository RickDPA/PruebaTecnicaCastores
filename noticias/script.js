document.addEventListener('DOMContentLoaded', () => {
    const newsForm = document.getElementById('news-form');
    const newsList = document.getElementById('news');
    
    newsForm.addEventListener('submit', (event) => {
      event.preventDefault();
      
      const title = event.target.title.value;
      const content = event.target.content.value;
      
      saveNews(title, content);
      
      event.target.reset();
    });
    
    function saveNews(title, content) {
      fetch('backend.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}`
      })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        updateNewsList();
      })
      .catch(error => console.error('Error al guardar la noticia:', error));
    }
    
    function updateNewsList() {
      fetch('backend.php')
        .then(response => response.json())
        .then(data => {
          newsList.innerHTML = '';
  
          data.forEach(newsItem => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
              <h3>${newsItem.titulo}</h3>
              <p>${newsItem.contenido}</p>
              <img src="${newsItem.imagen}" alt="Imagen de la noticia">
              <p>Fecha: ${newsItem.fecha_publicacion}</p>
              <h4>Comentarios:</h4>
              <ul class="comments">
                <!-- Comentarios se mostrarán aquí -->
              </ul>
              <form class="comment-form">
                <input type="text" placeholder="Nombre" class="comment-name">
                <textarea placeholder="Comentario" class="comment-content"></textarea>
                <button type="button" class="submit-comment">Enviar Comentario</button>
              </form>
            `;
            newsList.appendChild(listItem);
  
            
            const commentsList = listItem.querySelector('.comments');
            fetchComments(newsItem.id, commentsList);
  
           
            const commentForm = listItem.querySelector('.comment-form');
            commentForm.addEventListener('submit', event => {
              event.preventDefault();
              const commentName = commentForm.querySelector('.comment-name').value;
              const commentContent = commentForm.querySelector('.comment-content').value;
              saveComment(newsItem.id, commentName, commentContent, commentsList);
              commentForm.reset();
            });
          });
        })
        .catch(error => console.error('Error al obtener noticias:', error));
    }
  
    function fetchComments(newsId, commentsList) {
      
      fetch(`backend.php?news_id=${newsId}`)
        .then(response => response.json())
        .then(comments => {
          commentsList.innerHTML = '';
  
          comments.forEach(comment => {
            const commentItem = document.createElement('li');
            commentItem.innerHTML = `
              <strong>${comment.nombre}</strong>: ${comment.contenido}
            `;
            commentsList.appendChild(commentItem);
          });
        })
        .catch(error => console.error('Error al obtener comentarios:', error));
    }
  
    function saveComment(newsId, name, content, commentsList) {
      
      fetch('backend.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `news_id=${newsId}&name=${encodeURIComponent(name)}&content=${encodeURIComponent(content)}`
      })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        fetchComments(newsId, commentsList); 
      })
      .catch(error => console.error('Error al guardar el comentario:', error));
    }
  
    updateNewsList(); 
  });
  