import React from 'react'
import './CSS/Footer.css'

function Footer() {
  return (
    <>
    {/* Footer */}
      <footer className="footer">
        <div className="footerContent">
          <div className="footerSection">
            <h3 className="footerTitle">BlogHub</h3>
            <p className="footerText" >
              Your ultimate destination for sharing and discovering amazing content.
            </p>
          </div>
          
          <div className="footerSection" >
            <h4 className="footerHeading" >Quick Links</h4>
            <ul className="footerLinks" >
              <li><a href="#" className="footerLink" >Home</a></li>
              <li><a href="#" className="footerLink" >About</a></li>
              <li><a href="#" className="footerLink" >Write a Blog</a></li>
              <li><a href="#" className="footerLink" >Contact</a></li>
            </ul>
          </div>
          
          <div className="footerSection">
            <h4 className="footerHeading" >Categories</h4>
            <ul className="footerLinks">
              <li><a href="#" className="footerLink">Technology</a></li>
              <li><a href="#" className="footerLink">Design</a></li>
              <li><a href="#" className="footerLink">Development</a></li>
              <li><a href="#" className="footerLink">LifeclassName</a></li>
            </ul>
          </div>
          
          <div className="footerSection">
            <h4 className="footerHeading">Follow Us</h4>
            <div className="socialLinks">
              <a href="#" className="socialLink">Facebook</a>
              <a href="#" className="socialLink">Twitter</a>
              <a href="#" className="socialLink">Instagram</a>
              <a href="#" className="socialLink">LinkedIn</a>
            </div>
          </div>
        </div>
        
        <div className="footerBottom">
          <p className="copyright">© 2025 BlogHub. All rights reserved.</p>
          <div className="footerBottomLinks">
            <a href="#" className="footerBottomLink">Privacy Policy</a>
            <span className="separator">•</span>
            <a href="#" className="footerBottomLink">Terms of Service</a>
            <span className="separator">•</span>
            <a href="#" className="footerBottomLink">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
