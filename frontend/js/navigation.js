/**
 * Navigation Tab Functionality
 * Handles tab switching for left and right navigation menus
 */
document.addEventListener('DOMContentLoaded', () => {
  const tabButtons = document.querySelectorAll('.tab-btn');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.getAttribute('data-tab');
      const tabGroup = button.parentElement.classList.contains('left-nav-tabs') ? 'left' : 'right';
      
      const groupTabs = document.querySelectorAll(`.${tabGroup}-nav-tabs .tab-btn`);
      groupTabs.forEach(tab => tab.classList.remove('active'));
      
      const groupContent = document.querySelectorAll(`.${tabGroup}-nav .tab-content`);
      groupContent.forEach(content => content.classList.remove('active'));
      
      button.classList.add('active');
      
      const contentId = `${tabName}-content`;
      const content = document.getElementById(contentId);
      if (content) {
        content.classList.add('active');
      }
    });
  });
});
