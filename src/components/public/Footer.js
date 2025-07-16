import React, { useEffect, useState } from 'react';
import '../../css/imageSlider.css';
import '../../css/SocialMediaFloatingBar.css';
import { useNavigate  } from 'react-router-dom';
import { apiUrl, getSocialMedyaIcon, getSocialMediaBgColor } from '../../utils/utils';


const Footer = () => {
    const navigate = useNavigate();
    const [accounts, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hovered, setHovered] = useState(null); 
    

    useEffect(() => {          
        const fetchSocialMediaData = async () => {
            try {
                const response = await fetch(`${apiUrl}/social-media`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
  
                if (data.success) {
                    setData(data.accounts.filter((x) => x.active == true).sort());              
                }
            } catch (error) {
                console.error('Veriler yüklenirken hata:', error);
            } finally {
                setLoading(false);
            }
        };  
        fetchSocialMediaData();
    }, []);
    
     
  return ( 

    <div class="footer"> 
      <div className='form-container'>  
        <div class="row" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            
            <div class="col-4 social-media-footer-bar">
              <ul style={{ display: 'flex', justifyContent:'flex-end', gap:'4px', listStyleType: 'none', padding: 0, margin: 0}}>        
              {accounts.map((item, idx) => (
                <li>
                  <a
                      key={item.name}
                      href={item.mediaLink}
                      className="social-media-link-footer"
                      target="_blank"
                      rel="noopener noreferrer"
                      title={item.name}
                      style={{ backgroundColor: hovered === idx ? getSocialMediaBgColor(item.name) : getSocialMediaBgColor(item.name),
                                  backgroundColor:getSocialMediaBgColor(item.name),
                                  transition: 'background 0.2s, color 0.2s'
                      }}
                  >
                      <i className={`fa-brands ${getSocialMedyaIcon(item.name)}`}></i>
                      {/* <span className="social-media-label">{item.name}</span> */}
                  </a>
                </li> 
              
              ))}
            </ul>
            </div>
            <div class="col-8">               
                <p style={{textAlign:'center', fontSize:'12px', color:'gray'}}>
                    <a href="/">@aksainsaat </a> telif hakkı ihlali düşündüğünüz içerikler için lütfen 
                    <a href="/Contact" style={{color:'darkblue'}}> iletişim sayfamızdan</a> bizimle iletişime geçin.
                    <a href="/privacy-policy" style={{color:'darkblue'}}> Gizlilik Politikası</a> | 
                    <a href="/terms-of-service" style={{color:'darkblue'}}> Kullanım Şartları</a>
                </p>
            </div>
        </div> 
      </div>            
    </div>
  );
}
export default Footer;