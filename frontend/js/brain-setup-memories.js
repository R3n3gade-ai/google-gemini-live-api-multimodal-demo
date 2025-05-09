
window.loadMemoriesStep = function(container) {
  const content = document.createElement('div');
  
  const subtitle = document.createElement('div');
  subtitle.className = 'brain-setup-subtitle';
  subtitle.textContent = 'Upload memories to help your AI understand you better.';
  content.appendChild(subtitle);
  
  const uploadMethodsContainer = document.createElement('div');
  uploadMethodsContainer.className = 'upload-methods';
  
  const methods = [
    { id: 'text', icon: 'fa-file-alt', label: 'Text' },
    { id: 'file', icon: 'fa-file', label: 'File' },
    { id: 'folder', icon: 'fa-folder', label: 'Folder' },
    { id: 'software', icon: 'fa-laptop-code', label: 'Software Integration' },
    { id: 'wearable', icon: 'fa-tshirt', label: 'Wearable Integration' }
  ];
  
  let activeMethod = 'text';
  
  methods.forEach(method => {
    const methodElement = document.createElement('div');
    methodElement.className = `upload-method ${method.id === activeMethod ? 'active' : ''}`;
    methodElement.dataset.method = method.id;
    
    const icon = document.createElement('i');
    icon.className = `fas ${method.icon}`;
    
    const label = document.createElement('span');
    label.textContent = method.label;
    
    methodElement.appendChild(icon);
    methodElement.appendChild(label);
    
    methodElement.addEventListener('click', () => {
      document.querySelectorAll('.upload-method').forEach(el => el.classList.remove('active'));
      methodElement.classList.add('active');
      activeMethod = method.id;
      window.showUploadForm(method.id, uploadFormContainer);
    });
    
    uploadMethodsContainer.appendChild(methodElement);
  });
  
  content.appendChild(uploadMethodsContainer);
  
  const uploadFormContainer = document.createElement('div');
  uploadFormContainer.id = 'uploadFormContainer';
  content.appendChild(uploadFormContainer);
  
  window.showUploadForm(activeMethod, uploadFormContainer);
  
  const memoryListContainer = document.createElement('div');
  memoryListContainer.className = 'form-group';
  
  const memoryListLabel = document.createElement('div');
  memoryListLabel.className = 'form-label';
  memoryListLabel.textContent = 'Memory List';
  
  const memoryTable = document.createElement('table');
  memoryTable.className = 'memory-list';
  
  const tableHead = document.createElement('thead');
  const headRow = document.createElement('tr');
  
  ['Type', 'Name', 'Size', 'Uploaded', 'Actions', 'Details'].forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    headRow.appendChild(th);
  });
  
  tableHead.appendChild(headRow);
  memoryTable.appendChild(tableHead);
  
  const tableBody = document.createElement('tbody');
  tableBody.id = 'memoryTableBody';
  
  if (window.brainData.memories.length > 0) {
    window.brainData.memories.forEach(memory => {
      window.addMemoryToTable(memory, tableBody);
    });
  }
  
  memoryTable.appendChild(tableBody);
  memoryListContainer.appendChild(memoryListLabel);
  memoryListContainer.appendChild(memoryTable);
  content.appendChild(memoryListContainer);
  
  const footer = document.createElement('div');
  footer.className = 'brain-setup-footer';
  
  const backButton = document.createElement('button');
  backButton.className = 'btn btn-secondary';
  backButton.textContent = 'Back';
  backButton.addEventListener('click', () => {
    window.loadStep(1);
  });
  
  const nextButton = document.createElement('button');
  nextButton.className = 'btn btn-primary';
  nextButton.textContent = 'Next: Train Brain';
  nextButton.addEventListener('click', () => {
    window.loadStep(3);
  });
  
  footer.appendChild(backButton);
  footer.appendChild(nextButton);
  
  container.appendChild(content);
  container.appendChild(footer);
}

window.showUploadForm = function(method, container) {
  container.innerHTML = '';
  
  switch(method) {
    case 'text':
      const textForm = document.createElement('div');
      
      const textArea = document.createElement('textarea');
      textArea.className = 'form-textarea';
      textArea.placeholder = 'Enter your text here...';
      
      const saveButton = document.createElement('button');
      saveButton.className = 'btn btn-primary';
      saveButton.style.marginTop = '16px';
      saveButton.textContent = 'Save Text';
      saveButton.addEventListener('click', () => {
        if (textArea.value.trim()) {
          const memory = {
            type: 'text',
            name: `Text ${new Date().toLocaleTimeString()}`,
            size: `${textArea.value.length} chars`,
            uploaded: new Date().toLocaleString(),
            content: textArea.value
          };
          
          window.brainData.memories.push(memory);
          window.addMemoryToTable(memory, document.getElementById('memoryTableBody'));
          textArea.value = '';
        }
      });
      
      textForm.appendChild(textArea);
      textForm.appendChild(saveButton);
      container.appendChild(textForm);
      break;
      
    case 'file':
      const fileForm = document.createElement('div');
      
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.txt,.pdf,.md,.doc,.docx';
      fileInput.style.display = 'none';
      
      const fileButton = document.createElement('button');
      fileButton.className = 'btn btn-secondary';
      fileButton.innerHTML = '<i class="fas fa-upload"></i> Select File';
      fileButton.addEventListener('click', () => {
        fileInput.click();
      });
      
      const fileLabel = document.createElement('div');
      fileLabel.className = 'form-description';
      fileLabel.style.marginTop = '16px';
      fileLabel.textContent = 'Supported formats: TXT, PDF, MD, DOC, DOCX';
      
      fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
          const file = fileInput.files[0];
          const memory = {
            type: 'file',
            name: file.name,
            size: formatFileSize(file.size),
            uploaded: new Date().toLocaleString(),
            file: file
          };
          
          window.brainData.memories.push(memory);
          window.addMemoryToTable(memory, document.getElementById('memoryTableBody'));
        }
      });
      
      fileForm.appendChild(fileButton);
      fileForm.appendChild(fileInput);
      fileForm.appendChild(fileLabel);
      container.appendChild(fileForm);
      break;
      
    case 'folder':
      const folderForm = document.createElement('div');
      
      const folderInput = document.createElement('input');
      folderInput.type = 'file';
      folderInput.webkitdirectory = true;
      folderInput.directory = true;
      folderInput.style.display = 'none';
      
      const folderButton = document.createElement('button');
      folderButton.className = 'btn btn-secondary';
      folderButton.innerHTML = '<i class="fas fa-folder-open"></i> Select Folder';
      folderButton.addEventListener('click', () => {
        folderInput.click();
      });
      
      const folderLabel = document.createElement('div');
      folderLabel.className = 'form-description';
      folderLabel.style.marginTop = '16px';
      folderLabel.textContent = 'Upload an entire folder of documents';
      
      folderInput.addEventListener('change', () => {
        if (folderInput.files.length > 0) {
          const files = Array.from(folderInput.files);
          const folderName = files[0].webkitRelativePath.split('/')[0];
          
          const memory = {
            type: 'folder',
            name: folderName,
            size: `${files.length} files`,
            uploaded: new Date().toLocaleString(),
            files: files
          };
          
          window.brainData.memories.push(memory);
          window.addMemoryToTable(memory, document.getElementById('memoryTableBody'));
        }
      });
      
      folderForm.appendChild(folderButton);
      folderForm.appendChild(folderInput);
      folderForm.appendChild(folderLabel);
      container.appendChild(folderForm);
      break;
      
    default:
      const comingSoon = document.createElement('div');
      comingSoon.className = 'form-description';
      comingSoon.textContent = 'This feature is coming soon.';
      container.appendChild(comingSoon);
  }
}

window.addMemoryToTable = function(memory, tableBody) {
  const row = document.createElement('tr');
  
  const typeCell = document.createElement('td');
  typeCell.textContent = memory.type.charAt(0).toUpperCase() + memory.type.slice(1);
  
  const nameCell = document.createElement('td');
  nameCell.textContent = memory.name;
  
  const sizeCell = document.createElement('td');
  sizeCell.textContent = memory.size;
  
  const uploadedCell = document.createElement('td');
  uploadedCell.textContent = memory.uploaded;
  
  const actionsCell = document.createElement('td');
  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'memory-actions';
  
  const deleteButton = document.createElement('button');
  deleteButton.className = 'memory-action';
  deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
  deleteButton.addEventListener('click', () => {
    const index = window.brainData.memories.findIndex(m => 
      m.name === memory.name && m.uploaded === memory.uploaded
    );
    
    if (index !== -1) {
      window.brainData.memories.splice(index, 1);
      row.remove();
    }
  });
  
  actionsDiv.appendChild(deleteButton);
  actionsCell.appendChild(actionsDiv);
  
  const detailsCell = document.createElement('td');
  const viewButton = document.createElement('button');
  viewButton.className = 'memory-action';
  viewButton.innerHTML = '<i class="fas fa-eye"></i>';
  viewButton.addEventListener('click', () => {
    alert(`Memory details for ${memory.name}`);
  });
  detailsCell.appendChild(viewButton);
  
  row.appendChild(typeCell);
  row.appendChild(nameCell);
  row.appendChild(sizeCell);
  row.appendChild(uploadedCell);
  row.appendChild(actionsCell);
  row.appendChild(detailsCell);
  
  tableBody.appendChild(row);
}
