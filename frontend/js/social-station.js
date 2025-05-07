/**
 * Social Station Integration
 * Lightweight implementation for social media scheduling
 */
document.addEventListener('DOMContentLoaded', () => {
  const socialStationBtn = document.querySelector('.nav-button[data-feature="social-station"]');
  const mainContent = document.querySelector('.main-content');
  const socialStationContainer = document.getElementById('social-station-container');
  
  if (socialStationBtn && mainContent) {
    socialStationBtn.addEventListener('click', () => {
      document.querySelectorAll('.feature-container').forEach(container => {
        container.classList.add('hidden');
      });
      
      if (socialStationContainer) {
        socialStationContainer.classList.remove('hidden');
      } else {
        createSocialStationContainer();
      }
      
      document.querySelectorAll('.nav-button').forEach(btn => {
        btn.classList.remove('active');
      });
      socialStationBtn.classList.add('active');
    });
  }
  
  /**
   * Create Social Station container and append to main content
   */
  function createSocialStationContainer() {
    const container = document.createElement('div');
    container.id = 'social-station-container';
    container.className = 'feature-container social-station-container';
    
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();
    
    container.innerHTML = `
      <div class="social-station-layout">
        <!-- Left Panel: Create Schedule -->
        <div class="create-schedule-panel">
          <div class="panel-header">
            <h2>Create Schedule</h2>
            <button class="options-btn"><i class="fas fa-ellipsis-v"></i></button>
          </div>
          
          <div class="social-account-selector">
            <div class="account-info">
              <img src="https://via.placeholder.com/40" alt="Profile" class="profile-img">
              <span class="account-name">@AnjasTravel</span>
              <i class="fas fa-chevron-down"></i>
            </div>
            
            <div class="social-platforms">
              <button class="platform-btn linkedin"><i class="fab fa-linkedin-in"></i></button>
              <button class="platform-btn instagram"><i class="fab fa-instagram"></i></button>
              <button class="platform-btn facebook"><i class="fab fa-facebook-f"></i></button>
              <button class="platform-btn add"><i class="fas fa-plus"></i></button>
            </div>
          </div>
          
          <div class="post-type-tabs">
            <button class="tab-btn active"><i class="fas fa-file-alt"></i> Post</button>
            <button class="tab-btn"><i class="fas fa-image"></i> Story</button>
            <button class="tab-btn"><i class="fas fa-film"></i> Story</button>
          </div>
          
          <div class="post-content-editor">
            <div class="media-preview">
              <img src="https://via.placeholder.com/600x400?text=Mountain+Biking" alt="Post media" class="post-media">
            </div>
            
            <div class="post-text-content">
              <p>Experience the ultimate thrill of mountain biking as you conquer rugged trails, enjoy breathtaking scenery, and tackle adrenaline-pumping descents. Challenge yourself, push your limits, and embrace the excitement of outdoor adventure on two wheels!</p>
              
              <div class="hashtags">
                <span class="hashtag">#MountainBiking</span>
                <span class="hashtag">#OutdoorAdventure</span>
                <span class="hashtag">#TrailRiding</span>
                <span class="hashtag">#AdrenalineRush</span>
              </div>
            </div>
            
            <div class="post-actions">
              <button class="action-btn"><i class="fas fa-magic"></i> Rewrite With AI</button>
              <button class="action-btn"><i class="fas fa-arrow-right"></i> Continue</button>
              <button class="action-btn emoji-btn"><i class="far fa-smile"></i></button>
            </div>
          </div>
          
          <div class="schedule-options">
            <div class="schedule-time">
              <i class="far fa-clock"></i>
              <span>Sept 17, 12:22 PM</span>
              <i class="fas fa-chevron-down"></i>
            </div>
            
            <button class="schedule-btn">Schedule <i class="fas fa-chevron-down"></i></button>
          </div>
        </div>
        
        <!-- Right Panel: Calendar View -->
        <div class="calendar-panel">
          <div class="panel-header">
            <h2>Your Schedule</h2>
            
            <div class="calendar-filters">
              <div class="filter-dropdown">
                <span>Social Account</span>
                <i class="fas fa-chevron-down"></i>
              </div>
              
              <div class="filter-dropdown">
                <span>Post Status</span>
                <i class="fas fa-chevron-down"></i>
              </div>
              
              <div class="view-options">
                <button class="view-btn"><i class="fas fa-calendar-day"></i></button>
                <button class="view-btn active"><i class="fas fa-th-large"></i></button>
                <button class="view-btn"><i class="fas fa-list"></i></button>
              </div>
            </div>
          </div>
          
          <div class="calendar-navigation">
            <button class="nav-btn"><i class="fas fa-chevron-left"></i></button>
            <h3>Today</h3>
            <button class="nav-btn"><i class="fas fa-chevron-right"></i></button>
            <h3 class="current-date">19 Sept 2024</h3>
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
              <div class="calendar-day">
                <div class="day-number">1</div>
                <div class="day-posts">
                  <div class="post-thumbnail"><img src="https://via.placeholder.com/30" alt="Post"></div>
                  <div class="post-thumbnail"><img src="https://via.placeholder.com/30" alt="Post"></div>
                </div>
              </div>
              <div class="calendar-day">
                <div class="day-number">2</div>
                <div class="day-posts"></div>
              </div>
              <div class="calendar-day">
                <div class="day-number">3</div>
                <div class="day-posts"></div>
              </div>
              <div class="calendar-day">
                <div class="day-number">4</div>
                <div class="day-posts"></div>
              </div>
              <div class="calendar-day">
                <div class="day-number">5</div>
                <div class="day-posts"></div>
              </div>
              <div class="calendar-day">
                <div class="day-number">6</div>
                <div class="day-posts">
                  <div class="post-thumbnail"><img src="https://via.placeholder.com/30" alt="Post"></div>
                  <div class="post-thumbnail"><img src="https://via.placeholder.com/30" alt="Post"></div>
                  <div class="post-thumbnail"><img src="https://via.placeholder.com/30" alt="Post"></div>
                </div>
              </div>
              <div class="calendar-day">
                <div class="day-number">7</div>
                <div class="day-posts"></div>
              </div>
              
              <!-- Week 2 -->
              <div class="calendar-day">
                <div class="day-number">8</div>
                <div class="day-posts"></div>
              </div>
              <div class="calendar-day">
                <div class="day-number">9</div>
                <div class="day-posts"></div>
              </div>
              <div class="calendar-day">
                <div class="day-number">10</div>
                <div class="day-posts">
                  <div class="post-thumbnail"><img src="https://via.placeholder.com/30" alt="Post"></div>
                </div>
              </div>
              <div class="calendar-day">
                <div class="day-number">11</div>
                <div class="day-posts"></div>
              </div>
              <div class="calendar-day">
                <div class="day-number">12</div>
                <div class="day-posts"></div>
              </div>
              <div class="calendar-day">
                <div class="day-number">13</div>
                <div class="day-posts"></div>
              </div>
              <div class="calendar-day">
                <div class="day-number">14</div>
                <div class="day-posts"></div>
              </div>
              
              <!-- Week 3 -->
              <div class="calendar-day">
                <div class="day-number">15</div>
                <div class="day-posts">
                  <div class="post-thumbnail"><img src="https://via.placeholder.com/30" alt="Post"></div>
                  <div class="post-thumbnail"><img src="https://via.placeholder.com/30" alt="Post"></div>
                </div>
              </div>
              <div class="calendar-day">
                <div class="day-number">16</div>
                <div class="day-posts"></div>
              </div>
              <div class="calendar-day">
                <div class="day-number">17</div>
                <div class="day-posts"></div>
              </div>
              <div class="calendar-day">
                <div class="day-number">18</div>
                <div class="day-posts"></div>
              </div>
              <div class="calendar-day current-day">
                <div class="day-number">19</div>
                <div class="day-posts">
                  <div class="post-thumbnail"><img src="https://via.placeholder.com/30" alt="Post"></div>
                  <div class="post-thumbnail"><img src="https://via.placeholder.com/30" alt="Post"></div>
                  <div class="post-thumbnail"><img src="https://via.placeholder.com/30" alt="Post"></div>
                </div>
              </div>
              <div class="calendar-day">
                <div class="day-number">20</div>
                <div class="day-posts"></div>
              </div>
              <div class="calendar-day">
                <div class="day-number">21</div>
                <div class="day-posts"></div>
              </div>
              
              <!-- Remaining weeks -->
              <!-- Week 4 -->
              <div class="calendar-day">
                <div class="day-number">22</div>
                <div class="day-posts"></div>
              </div>
              <div class="calendar-day">
                <div class="day-number">23</div>
                <div class="day-posts"></div>
              </div>
              <div class="calendar-day">
                <div class="day-number">24</div>
                <div class="day-posts"></div>
              </div>
              <div class="calendar-day">
                <div class="day-number">25</div>
                <div class="day-posts"></div>
              </div>
              <div class="calendar-day">
                <div class="day-number">26</div>
                <div class="day-posts"></div>
              </div>
              <div class="calendar-day">
                <div class="day-number">27</div>
                <div class="day-posts"></div>
              </div>
              <div class="calendar-day">
                <div class="day-number">28</div>
                <div class="day-posts">
                  <div class="post-thumbnail"><img src="https://via.placeholder.com/30" alt="Post"></div>
                  <div class="post-thumbnail"><img src="https://via.placeholder.com/30" alt="Post"></div>
                </div>
              </div>
              
              <!-- Week 5 -->
              <div class="calendar-day">
                <div class="day-number">29</div>
                <div class="day-posts"></div>
              </div>
              <div class="calendar-day">
                <div class="day-number">30</div>
                <div class="day-posts"></div>
              </div>
              <div class="calendar-day disabled">
                <div class="day-number"></div>
                <div class="day-posts"></div>
              </div>
              <div class="calendar-day disabled">
                <div class="day-number"></div>
                <div class="day-posts"></div>
              </div>
              <div class="calendar-day disabled">
                <div class="day-number"></div>
                <div class="day-posts"></div>
              </div>
              <div class="calendar-day disabled">
                <div class="day-number"></div>
                <div class="day-posts"></div>
              </div>
              <div class="calendar-day disabled">
                <div class="day-number"></div>
                <div class="day-posts"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    mainContent.appendChild(container);
    initSocialStation();
  }
  
  /**
   * Initialize Social Station functionality
   */
  function initSocialStation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    if (tabButtons.length > 0) {
      tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          tabButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        });
      });
    }
    
    const calendarDays = document.querySelectorAll('.calendar-day:not(.disabled)');
    if (calendarDays.length > 0) {
      calendarDays.forEach(day => {
        day.addEventListener('click', () => {
          calendarDays.forEach(d => d.classList.remove('selected'));
          day.classList.add('selected');
        });
      });
    }
    
    const platformButtons = document.querySelectorAll('.platform-btn');
    if (platformButtons.length > 0) {
      platformButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          if (!btn.classList.contains('add')) {
            btn.classList.toggle('selected');
          }
        });
      });
    }
    
    const rewriteBtn = document.querySelector('.action-btn:first-child');
    if (rewriteBtn) {
      rewriteBtn.addEventListener('click', () => {
        const postContent = document.querySelector('.post-text-content p');
        if (postContent) {
          postContent.innerHTML = 'Embark on an exhilarating mountain biking adventure! Navigate challenging trails, soak in stunning panoramic views, and experience heart-racing descents. Push beyond your comfort zone, test your endurance, and discover the pure joy of exploring nature\'s playground on your trusty two-wheeler!';
        }
      });
    }
  }
});
