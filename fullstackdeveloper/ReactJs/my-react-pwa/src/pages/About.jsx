
function About() {
    return (
      <div>
        <h1>About Us</h1>
        <h1>is {navigator.onLine ? "Online" : "Offline" }</h1>
        <p>We are a demo React PWA application showing how to create a simple multi-page progressive web app using Vite.js and React.</p>
      </div>
    )
  }
  
  export default About