set -e


if [ ! -d "/home/ubuntu/repos/srcbook" ]; then
  echo "Cloning srcbook repository..."
  cd /home/ubuntu/repos
  git clone https://github.com/glassBead-tc/srcbook.git -b feat/MCP
  cd srcbook
else
  echo "Srcbook repository already exists, updating..."
  cd /home/ubuntu/repos/srcbook
  git checkout feat/MCP
  git pull
fi

cat > /home/ubuntu/repos/srcbook/packages/web/src/main.tsx << 'EOL'
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import './index.css';
import Layout, { loader as configLoader } from './Layout';
import { AppContext, AppProviders } from './routes/apps/context';
import AppPreview from './routes/apps/preview';
import AppFiles from './routes/apps/files';
import AppFilesShow from './routes/apps/files-show';
import {
  index as appIndex,
  preview as appPreview,
  filesShow as appFilesShow,
} from './routes/apps/loaders';
import ErrorPage from './error';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

// Disable PostHog tracking for our integration
const DISABLE_ANALYTICS = true;

if (!DISABLE_ANALYTICS) {
  posthog.init('phc_bQjmPYXmbl76j8gW289Qj9XILuu1STRnIfgCSKlxdgu', {
    api_host: 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
  });
}

// Modified router configuration that removes landing page and authentication routes
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    errorElement: <ErrorPage />,
    loader: configLoader,
    children: [
      // Direct to app builder by default
      {
        path: '/',
        loader: appIndex,
        element: <AppContext />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: '',
            loader: appPreview,
            element: (
              <AppProviders>
                <AppPreview />
              </AppProviders>
            ),
          },
        ],
      },
      // App routes
      {
        path: '/apps/:id',
        loader: appIndex,
        element: <AppContext />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: '',
            loader: appPreview,
            element: (
              <AppProviders>
                <AppPreview />
              </AppProviders>
            ),
          },
          {
            path: '/apps/:id/files',
            loader: appPreview,
            element: (
              <AppProviders>
                <AppFiles />
              </AppProviders>
            ),
          },
          {
            path: '/apps/:id/files/:path',
            loader: appFilesShow,
            element: (
              <AppProviders>
                <AppFilesShow />
              </AppProviders>
            ),
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PostHogProvider client={posthog}>
      <RouterProvider router={router} />
    </PostHogProvider>
  </React.StrictMode>,
);
EOL

echo "Building and running the App/Web Builder..."
cd /home/ubuntu/repos/srcbook
docker-compose up -d

echo "Waiting for the App/Web Builder to start..."
sleep 5

echo "Exposing the App/Web Builder on port 2150..."
curl -s http://localhost:2150 > /dev/null

echo "Adding App/Web Builder button to the main app..."
if ! grep -q "data-feature=\"app-builder\"" /home/ubuntu/repos/google-gemini-live-api-multimodal-demo/frontend/index.html; then
  sed -i '/<div class="tools-container">/a \
    <button class="nav-button" data-feature="app-builder">\
      <i class="fas fa-code"></i>\
      <span>App Builder</span>\
    </button>' /home/ubuntu/repos/google-gemini-live-api-multimodal-demo/frontend/index.html
fi

cat > /home/ubuntu/repos/google-gemini-live-api-multimodal-demo/frontend/js/app-builder.js << 'EOL'
document.addEventListener('DOMContentLoaded', () => {
  const appBuilderButton = document.querySelector('.nav-button[data-feature="app-builder"]');
  
  if (appBuilderButton) {
    appBuilderButton.addEventListener('click', () => {
      // Open App/Web Builder in a new tab
      window.open('http://localhost:2150', '_blank');
    });
  }
});
EOL

if ! grep -q "app-builder.js" /home/ubuntu/repos/google-gemini-live-api-multimodal-demo/frontend/index.html; then
  sed -i '/<\/body>/i \
    <script src="js/app-builder.js"></script>' /home/ubuntu/repos/google-gemini-live-api-multimodal-demo/frontend/index.html
fi

echo "App/Web Builder integration complete!"
echo "You can access the App/Web Builder at http://localhost:2150"
