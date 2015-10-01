
      window.onload = function (){
  function bind(domNode, event, handler) {
    var handlerWrapper = function(event) {
      event = event || window.event;
      if (!event.target && event.srcElement) {
        event.target = event.srcElement;
      }
      return handler.call(domNode, event);
    };
    if (domNode.addEventListener) {
      domNode.addEventListener(event, handlerWrapper, false);
    } else if (domNode.attachEvent) {
      domNode.attachEvent('on' + event, handlerWrapper);
    }
    return handlerWrapper;
  } 
  function createEmptyNoteList () {
    var noteObj = {
      noteArr : [],
      noteNum : 0,
      currentPage: 0
    };   
    return noteObj;
  }
  function showPage(pageNum){
    if (noteObj.noteNum > 0){
      var maxPage = Math.ceil(noteObj.noteNum/4)-1; 
      if (maxPage < pageNum){
        pageNum = maxPage;
        noteObj.currentPage = pageNum;
      } 
      console.log(noteObj);
      document.querySelector('.notelist').innerHTML='';
      var count = noteObj.noteNum - (pageNum)*4;    
      if (count<=0) { count = 4 - count };
      if (count >3) { count = 4};
      indicator.innerHTML = (noteObj.currentPage*4+count) +'/'+noteObj.noteNum;      
      for (var t = 0; t <= count-1; t++){
        var index = pageNum*4+t;
        document.querySelector('.notelist').innerHTML += '<div class="row note noselect"><div class="col-xs-10 text-justify"><p>'+noteObj.noteArr[index][0] +'</p><p><em>'+noteObj.noteArr[index][1] +'</em></p></div><div class="col-xs-2"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></div></div>';
      };
      var notes = document.querySelectorAll('.note');
      // обработчики событий динамических элементов
      Array.prototype.slice.call(notes).forEach(function (el,ind){        
        bind(el,'mouseover',function(){            
          indicator.innerHTML = noteObj.currentPage*4+1+ind +'/'+noteObj.noteNum;
        });
        bind(el,'mouseleave',function(){         
          if (noteObj.noteNum>0) {
            indicator.innerHTML = (noteObj.currentPage*4+count) +'/'+noteObj.noteNum;    
          } else {
            indicator.innerHTML = "0/0";
          }
          console.log('mouseover left');
        });
        bind(el.querySelector('.glyphicon-remove'),'click',function () { 
          deleteNote(ind); 
        });
      });
    } else {
      noteList.innerHTML = "<h2 class='text-center'>Заметок к показу нет.</h2>";      
      indicator.innerHTML = "0/0";
      console.log('clear fired');
    }
  }
  function saveNote(noteString){
    var date = new Date();
    noteObj.noteArr.push([noteString,formatDate(date)]);
    noteObj.noteNum++;   
    localStorage.setItem('noteapp',JSON.stringify(noteObj));
  };
  function deleteNote(ind){
    // удаление заметок
    console.log('note num ', ind,' deleting');
    console.log('current note object: ',noteObj);
    noteObj.noteArr.splice(noteObj.currentPage*4+ind,1);
    noteObj.noteNum--;
    
    console.log('edited note object: ',noteObj);
/** if ((noteObj.currentPage+1)>maxPage && noteObj.currentPage!==0){
      noteObj.currentPage--;            
    };**/
    localStorage.setItem('noteapp',JSON.stringify(noteObj));
    showPage(noteObj.currentPage);    
  }
  function formatDate(date){
    return ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) +'-'+ date.getFullYear()+' '+('0' + date.getHours()).slice(-2)+':'+('0' + date.getMinutes()).slice(-2)+':'+('0' + date.getSeconds()).slice(-2);
  }
  function initNoteApp(){
    if (!noteObj){    
      noteObj = createEmptyNoteList();
      localStorage.setItem('noteapp',JSON.stringify(noteObj));
      noteList.innerHTML = "<h2 class='text-center'>Заметок к показу нет.</h2>";
      indicator.innerHTML = "0/0";
    } else {
      noteObj = JSON.parse(noteObj);
      if (noteObj.noteNum === 0){
        noteList.innerHTML = "<h2 class='text-center'>Заметок к показу нет.</h2>";
        indicator.innerHTML = "0/0";
      }    
      showPage(noteObj.currentPage);
    }  
  }  
  
  var noteObj = localStorage.getItem('noteapp');  
  var editNoteMode = false;
  var addBtn = document.querySelector('#addBtn');
  var textArea = document.querySelector("#noteText");
  var indicator = document.querySelector('.indicator strong');  
  var prevPage = document.querySelector('#prevPage');
  var nextPage = document.querySelector('#nextPage');
  var noteList = document.querySelector('.notelist');
  
  initNoteApp();
  bind(addBtn,'click',function(){    
    var notes = document.querySelector('.notelist');
    var textarea = document.querySelector('#noteText');
    console.log('edit Mode', editNoteMode);
    if (editNoteMode === false){
      notes.classList.add('hidden');
      textarea.classList.remove('hidden'); 
      indicator.innerHTML = (noteObj.noteNum+1) + '/'+noteObj.noteNum;
      this.classList.add('disabled');
      editNoteMode = true;
    } else {
      saveNote(textArea.value);
      textarea.value = '';
      notes.classList.remove('hidden');
      textarea.classList.add('hidden');      
      indicator.innerHTML = (noteObj.currentPage*4+1) + '/'+noteObj.noteNum;
      this.classList.remove('disabled');
      showPage(noteObj.currentPage);
      editNoteMode = false;
    }
  });
  bind(textArea,'input', function(){
    if (this.value.length===0){
      addBtn.classList.add('disabled');
    } else {
      addBtn.classList.remove('disabled');
    }
  });
  bind(prevPage,'click',function(){
    if (noteObj.currentPage!==0 && !editNoteMode){
      noteObj.currentPage--;
      showPage(noteObj.currentPage);
    } else if (editNoteMode){
      // редактирование заметок
    }
  });
  bind(nextPage,'click',function(){    
    var maxPage = Math.floor(noteObj.noteNum/4);

    if (noteObj.noteNum>4 && noteObj.currentPage!==maxPage && !editNoteMode){
      noteObj.currentPage++;
      showPage(noteObj.currentPage);
    } else if (editNoteMode){
      // редактирование заметок
    }
  });  
  
}