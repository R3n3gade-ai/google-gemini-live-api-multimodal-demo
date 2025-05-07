/**
 * Social Station Integration
 * Lightweight implementation for social media scheduling
 */

let socialStationDashboard = null;
let contentCalendarTile = null;
let calendarView = null;
let mainContent = null;
let socialStationContainer = null;

/**
 * Initialize Social Station Dashboard
 * Exposed globally for content-manager.js to access
 */
window.initSocialStationDashboard = function() {
  socialStationDashboard = document.querySelector('.social-station-dashboard');
  
  const dashboardTiles = document.querySelectorAll('.social-station-dashboard .dashboard-tile');
  if (dashboardTiles.length > 0) {
    dashboardTiles.forEach(tile => {
      tile.addEventListener('click', (e) => {
        e.preventDefault();
        const feature = tile.getAttribute('href').substring(1);
        console.log('Tile clicked:', feature);
        
        if (feature === 'content-calendar') {
          showCalendarView();
        } else {
          hideAllViews();
          const featureName = tile.querySelector('h3').textContent;
          showComingSoonMessage(featureName);
        }
      });
    });
  } else {
    console.error('No dashboard tiles found');
  }
  
  console.log('Dashboard HTML:', socialStationDashboard ? socialStationDashboard.innerHTML : 'Dashboard not found');
};

/**
 * Show Calendar View
 */
function showCalendarView() {
  hideAllViews();
  
  if (!calendarView) {
    calendarView = document.querySelector('.social-station-container .social-station-view.social-station-layout');
    
    if (!calendarView) {
      calendarView = createCalendarView();
      socialStationContainer.appendChild(calendarView);
    } else {
      // Initialize the existing calendar view
      initCalendarView(calendarView);
    }
  }
  
  calendarView.classList.remove('hidden');
  
  const dashboard = document.querySelector('.social-station-dashboard');
  if (dashboard) {
    dashboard.classList.add('hidden');
  }
}

/**
 * Hide All Views
 */
function hideAllViews() {
  if (calendarView) {
    calendarView.classList.add('hidden');
  }
  
  const views = document.querySelectorAll('.social-station-view');
  views.forEach(view => {
    view.classList.add('hidden');
  });
}

/**
 * Show Coming Soon Message
 */
function showComingSoonMessage(featureName) {
  const comingSoonView = document.createElement('div');
  comingSoonView.className = 'social-station-view coming-soon-view';
  comingSoonView.innerHTML = `
    <div class="coming-soon-container">
      <i class="fas fa-tools"></i>
      <h2>${featureName} Coming Soon</h2>
      <p>We're working hard to bring you this feature. Check back later!</p>
      <button class="btn btn-primary" id="backToDashboardBtn">Back to Dashboard</button>
    </div>
  `;
  
  socialStationContainer.appendChild(comingSoonView);
  
  const backBtn = comingSoonView.querySelector('#backToDashboardBtn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      comingSoonView.remove();
      showDashboard();
    });
  }
}

/**
 * Show Dashboard
 */
function showDashboard() {
  hideAllViews();
  
  const dashboard = document.querySelector('.social-station-container > div:not(.social-station-layout)');
  if (dashboard) {
    dashboard.classList.remove('hidden');
  }
}

/**
 * Create Calendar View
 */
function createCalendarView() {
  const view = document.createElement('div');
  view.className = 'social-station-view social-station-layout';
  
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  const currentDay = currentDate.getDate();
  
  view.innerHTML = `
    <!-- Left Panel: Create Schedule -->
    <div class="create-schedule-panel">
      <div class="panel-header">
        <h2>Create &amp; Schedule</h2>
        <button class="options-btn"><i class="fas fa-ellipsis-v"></i></button>
      </div>
      
      <div class="social-account-selector">
        <div class="account-info">
          <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Profile" class="profile-img">
          <div class="account-name">Sarah Johnson</div>
        </div>
        
        <div class="social-platforms">
          <button class="platform-btn linkedin selected">
            <i class="fab fa-linkedin-in"></i>
          </button>
          <button class="platform-btn instagram">
            <i class="fab fa-instagram"></i>
          </button>
          <button class="platform-btn facebook">
            <i class="fab fa-facebook-f"></i>
          </button>
          <button class="platform-btn add">
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>
      
      <div class="post-type-tabs">
        <button class="tab-btn active">
          <i class="fas fa-align-left"></i>Text
        </button>
        <button class="tab-btn">
          <i class="fas fa-image"></i>Image
        </button>
        <button class="tab-btn">
          <i class="fas fa-video"></i>Video
        </button>
        <button class="tab-btn">
          <i class="fas fa-link"></i>Link
        </button>
      </div>
      
      <div class="post-content-editor">
        <div class="media-preview">
          <img src="https://images.unsplash.com/photo-1594739297262-188737d3c2b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1vdW50YWluJTIwYmlraW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60" alt="Mountain Biking" class="post-media">
        </div>
        
        <div class="post-text-content">
          <p>Hit the trails this weekend! Nothing beats the thrill of mountain biking through nature. Who's joining me for an adventure?</p>
          
          <div class="hashtags">
            <span class="hashtag">#MountainBiking</span>
            <span class="hashtag">#WeekendAdventure</span>
            <span class="hashtag">#OutdoorLife</span>
          </div>
        </div>
        
        <div class="post-actions">
          <button class="action-btn" id="rewriteBtn">
            <i class="fas fa-magic"></i>
            Rewrite
          </button>
          <button class="action-btn">
            <i class="fas fa-hashtag"></i>
            Add Hashtags
          </button>
          <button class="action-btn emoji-btn">
            <i class="far fa-smile"></i>
          </button>
        </div>
      </div>
      
      <div class="schedule-options">
        <div class="schedule-time">
          <i class="far fa-clock"></i>
          <span>Schedule for: May 8, 2025 at 10:00 AM</span>
        </div>
        
        <button class="schedule-btn">
          <i class="fas fa-paper-plane"></i>
          Schedule
        </button>
      </div>
    </div>
    
    <!-- Calendar Panel (Right Side) -->
    <div class="calendar-panel">
      <div class="panel-header">
        <h2>Content Calendar</h2>
        
        <div class="calendar-filters">
          <div class="filter-dropdown">
            <i class="fas fa-filter"></i>
            <span>Filter</span>
          </div>
          
          <div class="view-options">
            <button class="view-btn">
              <i class="fas fa-list"></i>
            </button>
            <button class="view-btn active">
              <i class="fas fa-th-large"></i>
            </button>
          </div>
        </div>
      </div>
      
      <div class="calendar-navigation">
        <button class="nav-btn">
          <i class="fas fa-chevron-left"></i>
        </button>
        
        <h3>May 2025</h3>
        
        <button class="nav-btn">
          <i class="fas fa-chevron-right"></i>
        </button>
        
        <span class="current-date">Today: May 7</span>
      </div>
      
      <div class="calendar-grid">
        <div class="calendar-header">
          <div class="day-header">Sun</div>
          <div class="day-header">Mon</div>
          <div class="day-header">Tue</div>
          <div class="day-header">Wed</div>
          <div class="day-header">Thu</div>
          <div class="day-header">Fri</div>
          <div class="day-header">Sat</div>
        </div>
        
        <div class="calendar-body">
          <!-- Week 1 -->
          <div class="calendar-day disabled">
            <div class="day-number">28</div>
          </div>
          <div class="calendar-day disabled">
            <div class="day-number">29</div>
          </div>
          <div class="calendar-day disabled">
            <div class="day-number">30</div>
          </div>
          <div class="calendar-day">
            <div class="day-number">1</div>
          </div>
          <div class="calendar-day">
            <div class="day-number">2</div>
            <div class="day-posts">
              <div class="post-thumbnail">
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dGVhbXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" alt="Post">
              </div>
            </div>
          </div>
          <div class="calendar-day">
            <div class="day-number">3</div>
          </div>
          <div class="calendar-day">
            <div class="day-number">4</div>
          </div>
          
          <!-- Week 2 -->
          <div class="calendar-day">
            <div class="day-number">5</div>
            <div class="day-posts">
              <div class="post-thumbnail">
                <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJ1c2luZXNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60" alt="Post">
              </div>
            </div>
          </div>
          <div class="calendar-day">
            <div class="day-number">6</div>
          </div>
          <div class="calendar-day current-day">
            <div class="day-number">7</div>
          </div>
          <div class="calendar-day selected">
            <div class="day-number">8</div>
            <div class="day-posts">
              <div class="post-thumbnail">
                <img src="https://images.unsplash.com/photo-1594739297262-188737d3c2b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1vdW50YWluJTIwYmlraW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60" alt="Post">
              </div>
            </div>
          </div>
          <div class="calendar-day">
            <div class="day-number">9</div>
          </div>
          <div class="calendar-day">
            <div class="day-number">10</div>
            <div class="day-posts">
              <div class="post-thumbnail">
                <img src="https://images.unsplash.com/photo-1504805572947-34fad45aed93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29mZmVlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60" alt="Post">
              </div>
            </div>
          </div>
          <div class="calendar-day">
            <div class="day-number">11</div>
          </div>
          
          <!-- Remaining days of the month -->
          <div class="calendar-day">
            <div class="day-number">12</div>
          </div>
          <div class="calendar-day">
            <div class="day-number">13</div>
          </div>
          <div class="calendar-day">
            <div class="day-number">14</div>
          </div>
          <div class="calendar-day">
            <div class="day-number">15</div>
          </div>
          <div class="calendar-day">
            <div class="day-number">16</div>
          </div>
          <div class="calendar-day">
            <div class="day-number">17</div>
          </div>
          <div class="calendar-day">
            <div class="day-number">18</div>
          </div>
          
          <!-- More days... -->
          <div class="calendar-day">
            <div class="day-number">19</div>
          </div>
          <div class="calendar-day">
            <div class="day-number">20</div>
          </div>
          <div class="calendar-day">
            <div class="day-number">21</div>
          </div>
          <div class="calendar-day">
            <div class="day-number">22</div>
          </div>
          <div class="calendar-day">
            <div class="day-number">23</div>
          </div>
          <div class="calendar-day">
            <div class="day-number">24</div>
          </div>
          <div class="calendar-day">
            <div class="day-number">25</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Initialize calendar view functionality
  setTimeout(() => {
    initCalendarView(view);
  }, 100);
  
  return view;
}

/**
 * Create Social Station container and append to main content
 */
function createSocialStationContainer() {
  const container = document.createElement('div');
  container.id = 'social-station-container';
  container.className = 'feature-container social-station-container';
  
  container.innerHTML = `
    <div class="social-station-header">
      <h2>Social Station</h2>
      <p>Manage your social media presence with AI</p>
    </div>
    
    <div class="social-station-dashboard">
      <a href="#content-calendar" class="dashboard-tile">
        <div class="tile-icon">
          <i class="fas fa-calendar-alt"></i>
        </div>
        <h3>Content Calendar</h3>
        <p>Schedule and plan your content</p>
      </a>
      
      <a href="#analytics" class="dashboard-tile">
        <div class="tile-icon">
          <i class="fas fa-chart-line"></i>
        </div>
        <h3>Analytics</h3>
        <p>Track performance and engagement</p>
      </a>
      
      <a href="#community" class="dashboard-tile">
        <div class="tile-icon">
          <i class="fas fa-comments"></i>
        </div>
        <h3>Community Management</h3>
        <p>Engage with your audience</p>
      </a>
      
      <a href="#campaigns" class="dashboard-tile">
        <div class="tile-icon">
          <i class="fas fa-bullhorn"></i>
        </div>
        <h3>Campaign Creation</h3>
        <p>Create and manage marketing campaigns</p>
      </a>
    </div>
    
    <div class="social-station-footer">
      <button class="btn btn-primary" id="returnToChatBtn">
        <i class="fas fa-arrow-left"></i>
        Return to Chat
      </button>
    </div>
  `;
  
  mainContent.appendChild(container);
  socialStationContainer = container;
  
  const returnBtn = container.querySelector('#returnToChatBtn');
  if (returnBtn) {
    returnBtn.addEventListener('click', () => {
      document.querySelectorAll('.feature-container').forEach(container => {
        container.classList.add('hidden');
      });
      
      const mainCard = document.querySelector('.main-card');
      if (mainCard) {
        mainCard.classList.remove('hidden');
      }
      
      const chatContainer = document.querySelector('.chat-container');
      if (chatContainer) {
        chatContainer.classList.remove('hidden');
      }
      
      document.querySelectorAll('.nav-button').forEach(btn => {
        btn.classList.remove('active');
      });
      
      const chatBtn = document.querySelector('.nav-button[data-feature="chat"]');
      if (chatBtn) {
        chatBtn.classList.add('active');
      }
    });
  }
  
  window.initSocialStationDashboard();
}

/**
 * Initialize Calendar View functionality
 */
function initCalendarView(view) {
  const tabButtons = view.querySelectorAll('.tab-btn');
  if (tabButtons.length > 0) {
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }
  
  const calendarDays = view.querySelectorAll('.calendar-day:not(.disabled)');
  if (calendarDays.length > 0) {
    calendarDays.forEach(day => {
      day.addEventListener('click', () => {
        calendarDays.forEach(d => d.classList.remove('selected'));
        day.classList.add('selected');
      });
    });
  }
  
  const platformButtons = view.querySelectorAll('.platform-btn');
  if (platformButtons.length > 0) {
    platformButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (!btn.classList.contains('add')) {
          platformButtons.forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
        }
      });
    });
  }
  
  const rewriteBtn = view.querySelector('#rewriteBtn');
  if (rewriteBtn) {
    rewriteBtn.addEventListener('click', () => {
      const postContent = view.querySelector('.post-text-content p');
      if (postContent) {
        postContent.innerHTML = 'Embark on an exhilarating mountain biking adventure! Navigate challenging trails, soak in stunning panoramic views, and experience heart-racing descents. Push beyond your comfort zone, test your endurance, and discover the pure joy of exploring nature\'s playground on your trusty two-wheeler!';
      }
    });
  }
  
  // Add event listener for Return to Chat button in calendar view
  const returnToChatBtn = document.querySelector('#returnToChatBtn');
  if (returnToChatBtn) {
    returnToChatBtn.addEventListener('click', () => {
      document.querySelectorAll('.feature-container').forEach(container => {
        container.classList.add('hidden');
      });
      
      const mainCard = document.querySelector('.main-card');
      if (mainCard) {
        mainCard.classList.remove('hidden');
      }
      
      const chatContainer = document.querySelector('.chat-container');
      if (chatContainer) {
        chatContainer.classList.remove('hidden');
      }
      
      document.querySelectorAll('.nav-button').forEach(btn => {
        btn.classList.remove('active');
      });
      
      const chatBtn = document.querySelector('.nav-button[data-feature="chat"]');
      if (chatBtn) {
        chatBtn.classList.add('active');
      }
    });
  }
  
  const calendarHeader = view.querySelector('.panel-header');
  if (calendarHeader) {
    const backButton = document.createElement('button');
    backButton.className = 'back-btn';
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Back';
    backButton.addEventListener('click', showDashboard);
    
    calendarHeader.insertBefore(backButton, calendarHeader.firstChild);
  }
}

// Initialize Social Station when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  mainContent = document.querySelector('.main-content');
  
  const socialStationBtn = document.querySelector('.nav-button[data-feature="social-station"]');
  if (socialStationBtn && mainContent) {
    socialStationBtn.addEventListener('click', () => {
      document.querySelectorAll('.feature-container').forEach(container => {
        container.classList.add('hidden');
      });
      
      socialStationContainer = document.getElementById('social-station-container');
      if (socialStationContainer) {
        socialStationContainer.classList.remove('hidden');
        
        if (!socialStationDashboard) {
          window.initSocialStationDashboard();
        }
      } else {
        createSocialStationContainer();
      }
      
      document.querySelectorAll('.nav-button').forEach(btn => {
        btn.classList.remove('active');
      });
      socialStationBtn.classList.add('active');
    });
  }
});
