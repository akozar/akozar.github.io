var NOTES_PER_PAGE = 4;
var currentPage, maxPage, editMode;
var notes = JSON.parse(localStorage.getItem('notes'));

function initNoteApp() {
  if (!notes) {
    notes = createEmptyNoteArr();
    currentPage = 0;
  } else if (notes.length <= NOTES_PER_PAGE) {
    currentPage = 0;
  } else {
    currentPage = JSON.parse(localStorage.getItem('noteapp_page'));
  }
  editMode = false;
  showPage(currentPage);
}

function createEmptyNoteArr() {
  var notes = []
  return notes;
}

function formatDate(fulldate) {
  function getTwoDigitsNumber(num) {
    return ('0' + num).slice(-2);
  };
  fulldate = new Date(fulldate);
  var date = getTwoDigitsNumber(fulldate.getDate());
  month = getTwoDigitsNumber(fulldate.getMonth() + 1);
  year = getTwoDigitsNumber(fulldate.getFullYear());
  hours = getTwoDigitsNumber(fulldate.getHours());
  minutes = getTwoDigitsNumber(fulldate.getMinutes());
  seconds = getTwoDigitsNumber(fulldate.getSeconds());
  return date + '-' + month + '-' + year + ' ' + hours + ':' + minutes + ':' + seconds;
}

function saveNote(noteText) {
  var date = new Date();
  notes.push({
    noteText: noteText,
    createDate: date
  });
};

function deleteNote(indexOnPage) {
  if (confirm('Вы точно хотите удалить заметку?')) {
    notes.splice(currentPage * NOTES_PER_PAGE + indexOnPage, 1);
  }
  showPage(currentPage);
}

// Pages are counted from 0
function showPage(pageNum) {
    noteList.innerHTML = '';
    if (notes.length === 0) {
      noteList.innerHTML = "<h2 class='text-center'>Заметок к показу нет.</h2>";
      statusPanel.classList.add('hidden');
      return;
    }
    maxPage = Math.ceil(notes.length / NOTES_PER_PAGE) - 1;
    if (pageNum > maxPage) {
      pageNum = maxPage;
    } else if (pageNum < 0) {
      pageNum = 0;
    }
    statusPanel.classList.remove('hidden');
    for (var i = pageNum * NOTES_PER_PAGE; i < (pageNum + 1) * NOTES_PER_PAGE; i++) {
      if (notes[i]) {
        document.querySelector('.notelist').innerHTML += '<div class="row note noselect"><div class="col-xs-10 text-justify"><p>' + notes[i].noteText + '</p><p><em>' + formatDate(notes[i].createDate) + '</em></p></div><div class="col-xs-2"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></div></div>';
      } else {
        break;
      }
    }
    var noteNodes = document.querySelectorAll('.note');
    [].forEach.call(noteNodes, function(el, ind) {
      el.querySelector('.glyphicon-remove').addEventListener('click', function() {
        deleteNote(ind);
      }, false);
    })
    indicator.innerHTML = (pageNum + 1) + ' из ' + (maxPage + 1) + ' стр.';
    currentPage = pageNum;
  }
  // Saving NoteApp variables to localStorage
function saveNoteApp() {
  localStorage.setItem('notes', JSON.stringify(notes));
  localStorage.setItem('noteapp_page', JSON.stringify(currentPage));
}

function addBtnHandler() {
  if (editMode) {
    saveNote(textArea.value);
    setEditMode(false);
    showPage(currentPage);
  } else {
    setEditMode(true);
  }
}

function backBtnHandler() {
  setEditMode(false);
  showPage(currentPage);
}

// This function sets editMode and makes appropriate design
function setEditMode(mode) {
  if (mode === false) {
    textArea.value = '';
    noteList.classList.remove('hidden');
    textArea.classList.add('hidden');
    backBtn.classList.add('hidden');
    addBtn.innerHTML = 'Добавить заметку';
    addBtn.classList.remove('disabled');
    addBtn.classList.remove('btn-success');
    addBtn.classList.add('btn-primary');
    editMode = false;
  } else {
    noteList.classList.add('hidden');
    textArea.classList.remove('hidden');
    textArea.focus();
    backBtn.classList.remove('hidden');
    addBtn.classList.add('disabled');
    addBtn.classList.remove('btn-primary');
    addBtn.classList.add('btn-success');
    addBtn.innerHTML = '<span class="glyphicon glyphicon-send" aria-hidden="true"></span> Добавить заметку';
    statusPanel.classList.add('hidden');
    editMode = true;
  }
}

function textareaHandler() {
  if (textArea.value.length === 0) {
    addBtn.classList.add('disabled');
  } else {
    addBtn.classList.remove('disabled');
  }
}

function prevPageHandler() {
  if (currentPage !== 0) {
    currentPage--;
    showPage(currentPage);
  }
}

function nextPageHandler() {
  if (notes.length > NOTES_PER_PAGE && currentPage !== maxPage) {
    currentPage++;
    showPage(currentPage);
  }
}

var addBtn = document.querySelector('#addBtn');
var backBtn = document.querySelector('#backBtn');
var noteList = document.querySelector('.notelist');
var textArea = document.querySelector('#noteText');
var indicator = document.querySelector('.indicator strong');
var prevPage = document.querySelector('#prevPage');
var nextPage = document.querySelector('#nextPage');
var statusPanel = document.querySelector('#statusPanel');

window.addEventListener('unload', saveNoteApp, false);
addBtn.addEventListener('click', addBtnHandler, false);
backBtn.addEventListener('click', backBtnHandler, false);
textArea.addEventListener('input', textareaHandler, false);
prevPage.addEventListener('click', prevPageHandler, false);
nextPage.addEventListener('click', nextPageHandler, false);

initNoteApp();