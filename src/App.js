import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import logo from './logo.svg';
import './App.css';
import Dashboard from './components/Dashboard';

function App() {
  useEffect(() => {
    console.clear();
    console.log("%cWARNING", "color: red; font-size: 50px; font-weight: bold;");
    console.log(
      "%c##############################\n" +
      "Unauthorized Access Prohibited\n" +
      "##############################\n" +
      "This console is intended for use by authorized personnel only. " +
      "If you have been instructed to enter or execute any code here to manipulate or bypass examination controls, " +
      "please be advised that such actions are strictly prohibited and will be treated as a violation of the examination code of conduct.\n\n" +
      "Unauthorized activity will result in immediate disqualification from the examination, " +
      "and further disciplinary or legal actions may follow.\n",
      "font-size: 16px; color: white; background-color: black; padding: 6px;"
    );
    console.log(
      "%cMonitoring and Logging Notice:\n" +
      "----------------------------------\n" +
      "All actions in this console are monitored and logged. " +
      "Any attempts to interfere with the system will be detected and recorded.\n",
      "font-size: 14px; color: yellow; background-color: black; padding: 4px;"
    );

    document.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });
    // document.addEventListener('cut', function(e) {
    //   e.preventDefault();
    // });
    // document.addEventListener('copy', function(e) {
    //   e.preventDefault();
    // });
    // document.addEventListener('paste', function(e) {
    //   e.preventDefault();
    // });
    document.addEventListener('touchstart', function (e) {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    });
    document.addEventListener('beforeinput', function (e) {
      if (e.inputType === 'historyUndo' || e.inputType === 'historyRedo') {
        e.preventDefault();
      }
    });
    function isMacOS() {
      if (navigator.userAgentData) {
        return navigator.userAgentData.platform === 'macOS';
      } else {
        return /Macintosh|MacIntel|MacPPC|Mac68K|iPhone|iPad|iPod/.test(navigator.userAgent);
      }
    }
    document.addEventListener('keydown', function (e) {
      const isMac = isMacOS();
      if ((!isMac && e.ctrlKey && e.key === 'a') || (isMac && e.metaKey && e.key === 'a')) {
        e.preventDefault();
      }
      // if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
      //   e.preventDefault();
      // }
      if (isMac && e.metaKey && e.altKey && e.key === 'I') {
        e.preventDefault();
      }
      if (isMac && e.metaKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
      }
      if (e.key === 'F5') {
        e.preventDefault();
      }

      // Prevent Ctrl+R (Standard refresh)
      if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
      }

      // Prevent Ctrl+Shift+R (Hard refresh)
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
      }

      // Prevent Ctrl+F5 (Hard refresh)
      if (e.ctrlKey && e.key === 'F5') {
        e.preventDefault();
      }

      // Prevent Cmd+R (on macOS)
      if (isMac && e.metaKey && e.key === 'r') {
        e.preventDefault();
      }

      // Prevent Cmd+Shift+R (on macOS)
      if (isMac && e.metaKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
      }
    });

    const scriptId = 'google-client-script';

    const handleCredentialResponse = (response) => {

      const token = response.credential
      fetch("https://asia-south1-ppt-tts.cloudfunctions.net/ml-quiz1/report",
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
        .then(response => response.json()
          .then(data => {
            if (response.ok) {
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            // Create a link element to download the JSON file
            const a = document.createElement('a');
            a.href = url;
            a.download = 'data.json'; // Set the file name
            document.body.appendChild(a);
            a.click(); // Trigger the download
            document.body.removeChild(a)
              const root = createRoot(document.getElementById("main"));
              root.render(<Dashboard token={token} data={data} />);
            } else {
              document.getElementById("main").innerHTML = `<h1 style="color: red;">${data.error}</h1>`;
            }
          })
        )
        .catch(error => {
          console.error('Error:', error);
        })
    };

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      document.head.appendChild(script);
    }

    window.onGoogleLibraryLoad = () => {
      google.accounts.id.initialize({
        client_id: '1066118926351-dskshp8i64e3e4i5rr76h85rfbhh5cc0.apps.googleusercontent.com',
        auto_select: true,
        callback: handleCredentialResponse,
        context: "use",
        itp_support: true,
        hd: 'flame.edu.in',
        use_fedcm_for_prompt: true,
      });
      google.accounts.id.prompt();
      google.accounts.id.renderButton(
        document.getElementById("google-button"),
        {
          text: 'continue_with',
          theme: "outline",
          shape: 'pill',
        }
      );
    };
  }, []);

  return (
    <div id="main" className="App">
      <h1>ML Exam Portal</h1>
      <img src={logo} className="App-logo" alt="logo" />
      <br></br>
      <div id="google-button"></div>
    </div>
  );
}

export default App;
