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
            
            <div class="col-8">               
                <p style={{textAlign:'center', fontSize:'12px', color:'gray'}}>
                    Aksa İnşaat tarafından geliştirmiştir, tüm hakları saklıdır.
                    <a href="/privacy-policy" style={{color:'darkblue'}}>Gizlilik Politikası</a> | 
                    <a href="/terms-of-service" style={{color:'darkblue'}}>Kullanım Şartları</a>
                </p>
            </div>
            <div class="col-4">
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
        </div> 
      </div>            
    </div>
  );
}
export default Footer;

// import React, { useEffect, useState } from 'react';
// import '../../css/imageSlider.css';
// import { serverUrl, apiUrl } from '../../utils/utils';


// const Footer = () => {
//     const [referenceList, setReferenceList] = useState([]);
//     const scrollRef = React.useRef(null);  
//   useEffect(() => {
//     // Sayfa yüklendiğinde referans resimlerini al
//     fetchReferenceList();
//   }, []);

//  useEffect(() => {
//   if (referenceList.length > 0) {
//     let resetTimeout = null;
//     const interval = setInterval(() => {
//       if (scrollRef.current) {
//         // Toleransı artırın (ör: 30px)
//         if (
//           scrollRef.current.scrollLeft + scrollRef.current.offsetWidth >=
//           scrollRef.current.scrollWidth - 30
//         ) {
//           // Son resme gelince kısa bir bekleme ile başa dön
//           if (!resetTimeout) {
//               resetTimeout = setTimeout(() => {
//                 scrollRef.current.scrollLeft = 0;
//                 resetTimeout = null;
//               }, 500); // 0.5 saniye bekle
//           }
//         } else {
//           scrollRef.current.scrollLeft += 2;
//         }
//       }
//     }, 30);
//     return () => {
//       clearInterval(interval);
//       if (resetTimeout) clearTimeout(resetTimeout);
//     };
//   }
// }, [referenceList]);

//   const fetchReferenceList = async () => {
//       try {
//         const response = await fetch(`${apiUrl}/references/referenceList`);
//         const data = await response.json();

//         if (data.success) {

//           data.references.map(ref => {
//              ref.imageUrl = `${serverUrl}${ref.imageUrl}`;
//           });

//           if(data.references.length > 0){
//             setReferenceList(data.references);
//           }
//         } else {
//           console.error('Referans resimleri alınamadı:', data.message);
//         }
//       } catch (error) {
//         console.error('Referans resimleri alınırken hata:', error);
//       }
//     };

//   return ( 

//     <div class="footer">   
//         {referenceList && referenceList.length > 0 && (
//           <div className="image-section-slider">
//             <div className="slider-container" ref={scrollRef}>
//               {referenceList.map((ref, index) => (
//               <div className="slider-feature-card" key={index}>
//                 {ref.webLink ? (
//                   <a href={ref.webLink} target="_blank" rel="noopener noreferrer">
//                     <img
//                       src={ref.imageUrl}
//                       className="slider-image"
//                       alt={`Referans ${index + 1}`}
//                     />
//                   </a>
//                 ) : (
//                   <img
//                     src={ref.imageUrl}
//                     className="slider-image"
//                     alt={`Referans ${index + 1}`}
//                   />
//                 )}
//               </div>
//             ))}
//             </div>
//           </div>
//         )}
//         <div class="copyright">
//             <a href="/">@aksainsaat </a> telif hakkı ihlali düşündüğünüz içerikler için lütfen 
//             <a href="/Contact" style={{color:'darkblue'}}>iletişim sayfamızdan</a> bizimle iletişime geçin.
//         </div> 
//     </div>
//   );
// }
// export default Footer;