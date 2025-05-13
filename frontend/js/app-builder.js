/**
 * App/Web Builder Integration
 * Connects the AI Workstation to the App/Web Builder
 */

document.addEventListener('DOMContentLoaded', () => {
  const appBuilderButton = document.querySelector('.nav-button[data-feature="app-builder"]');
  
  if (appBuilderButton) {
    appBuilderButton.addEventListener('click', () => {
      const modal = document.createElement('div');
      modal.className = 'app-builder-modal';
      
      const modalContent = document.createElement('div');
      modalContent.className = 'app-builder-modal-content';
      
      const modalHeader = document.createElement('div');
      modalHeader.className = 'app-builder-modal-header';
      modalHeader.innerHTML = `
        <h2>App/Web Builder</h2>
        <button class="app-builder-close-button">&times;</button>
      `;
      
      const modalBody = document.createElement('div');
      modalBody.className = 'app-builder-modal-body';
      
      const appBuilderContainer = document.createElement('div');
      appBuilderContainer.className = 'app-builder-container';
      appBuilderContainer.innerHTML = `
        <div class="sidebar">
            <h2>App/Web Builder</h2>
            <div class="app-list">
                <div class="section-title">Your Apps</div>
                <div class="app-item">
                    <h3>My First App</h3>
                    <p>Last edited: Today</p>
                </div>
                <div class="app-item">
                    <h3>Customer Dashboard</h3>
                    <p>Last edited: Yesterday</p>
                </div>
                <div class="app-item">
                    <h3>Analytics Portal</h3>
                    <p>Last edited: 3 days ago</p>
                </div>
                <button class="button" style="width: 100%; margin-top: 15px;">
                    <i class="fas fa-plus"></i> New App
                </button>
            </div>
        </div>
        
        <div class="main-content">
            <div class="header">
                <h2>My First App</h2>
                <div>
                    <button class="button">
                        <i class="fas fa-play"></i> Preview
                    </button>
                    <button class="button" style="margin-left: 10px;">
                        <i class="fas fa-save"></i> Save
                    </button>
                    <button class="button" style="margin-left: 10px;">
                        <i class="fas fa-share"></i> Publish
                    </button>
                </div>
            </div>
            
            <div class="component-list">
                <div class="section-title">Components</div>
                <div class="component-item">
                    <i class="fas fa-font"></i>
                    <p>Text</p>
                </div>
                <div class="component-item">
                    <i class="fas fa-image"></i>
                    <p>Image</p>
                </div>
                <div class="component-item">
                    <i class="fas fa-square"></i>
                    <p>Container</p>
                </div>
                <div class="component-item">
                    <i class="fas fa-button"></i>
                    <p>Button</p>
                </div>
                <div class="component-item">
                    <i class="fas fa-table"></i>
                    <p>Table</p>
                </div>
                <div class="component-item">
                    <i class="fas fa-chart-bar"></i>
                    <p>Chart</p>
                </div>
                <div class="component-item">
                    <i class="fas fa-list"></i>
                    <p>List</p>
                </div>
                <div class="component-item">
                    <i class="fas fa-keyboard"></i>
                    <p>Form</p>
                </div>
            </div>
            
            <div class="canvas">
                <div class="canvas-empty">
                    <i class="fas fa-plus-circle"></i>
                    <p>Drag and drop components here to build your app</p>
                    <button class="button" style="margin-top: 15px;">
                        <i class="fas fa-magic"></i> Generate from AI
                    </button>
                </div>
            </div>
        </div>
      `;
      
      const fontAwesomeLink = document.createElement('link');
      fontAwesomeLink.rel = 'stylesheet';
      fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
      document.head.appendChild(fontAwesomeLink);
      
      const appBuilderStyles = document.createElement('style');
      appBuilderStyles.textContent = `
        .app-builder-container {
            display: flex;
            height: 100%;
            font-family: 'Arial', sans-serif;
            color: #ffffff;
        }
        
        .sidebar {
            width: 250px;
            background-color: #252525;
            padding: 20px;
            border-right: 1px solid #333;
            overflow-y: auto;
        }
        
        .main-content {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #333;
        }
        
        .app-list {
            margin-top: 20px;
        }
        
        .app-item {
            background-color: #2d2d2d;
            border-radius: 6px;
            padding: 15px;
            margin-bottom: 15px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        .app-item:hover {
            background-color: #3d3d3d;
        }
        
        .app-item h3 {
            margin: 0 0 10px 0;
        }
        
        .app-item p {
            margin: 0;
            color: #aaa;
            font-size: 14px;
        }
        
        .button {
            background-color: #0078d4;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s;
        }
        
        .button:hover {
            background-color: #0066b3;
        }
        
        .section-title {
            font-size: 18px;
            margin-bottom: 15px;
            color: #ddd;
        }
        
        .component-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        
        .component-item {
            background-color: #2d2d2d;
            border-radius: 6px;
            padding: 15px;
            text-align: center;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        .component-item:hover {
            background-color: #3d3d3d;
        }
        
        .component-item i {
            font-size: 24px;
            margin-bottom: 10px;
            color: #0078d4;
        }
        
        .component-item p {
            margin: 0;
            font-size: 14px;
        }
        
        .canvas {
            background-color: #252525;
            border-radius: 6px;
            min-height: 500px;
            margin-top: 20px;
            padding: 20px;
            border: 1px dashed #555;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        
        .canvas-empty {
            color: #777;
            text-align: center;
        }
        
        .canvas-empty i {
            font-size: 48px;
            margin-bottom: 15px;
            color: #555;
        }
      `;
      
      modalBody.appendChild(appBuilderContainer);
      modalContent.appendChild(modalHeader);
      modalContent.appendChild(modalBody);
      modal.appendChild(modalContent);
      document.head.appendChild(appBuilderStyles);
      document.body.appendChild(modal);
      
      const closeButton = modal.querySelector('.app-builder-close-button');
      closeButton.addEventListener('click', () => {
        modal.remove();
        document.head.removeChild(fontAwesomeLink);
        document.head.removeChild(appBuilderStyles);
      });
      
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
          document.head.removeChild(fontAwesomeLink);
          document.head.removeChild(appBuilderStyles);
        }
      });
      
      const componentItems = modal.querySelectorAll('.component-item');
      componentItems.forEach(item => {
        item.addEventListener('click', function() {
          const canvasEmpty = modal.querySelector('.canvas-empty');
          if (canvasEmpty) {
            canvasEmpty.style.display = 'none';
          }
          
          const componentType = this.querySelector('p').textContent;
          const newElement = document.createElement('div');
          newElement.style.padding = '20px';
          newElement.style.margin = '10px';
          newElement.style.backgroundColor = '#333';
          newElement.style.borderRadius = '4px';
          newElement.style.width = '80%';
          
          switch(componentType) {
            case 'Text':
              newElement.innerHTML = '<h3>Sample Text</h3><p>This is a sample text component. Click to edit.</p>';
              break;
            case 'Button':
              newElement.innerHTML = '<button style="padding: 10px 20px; background-color: #0078d4; color: white; border: none; border-radius: 4px;">Sample Button</button>';
              break;
            case 'Image':
              newElement.innerHTML = '<div style="width: 200px; height: 150px; background-color: #555; display: flex; align-items: center; justify-content: center;"><i class="fas fa-image" style="font-size: 48px; color: #777;"></i></div>';
              break;
            default:
              newElement.innerHTML = `<p>${componentType} Component</p>`;
          }
          
          modal.querySelector('.canvas').appendChild(newElement);
        });
      });
      
      const appItems = modal.querySelectorAll('.app-item');
      appItems.forEach(item => {
        item.addEventListener('click', function() {
          modal.querySelector('.header h2').textContent = this.querySelector('h3').textContent;
        });
      });
    });
  }
});
