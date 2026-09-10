import { useState, useEffect } from "react";
// Hybrid
import { useAnimate,stagger } from "motion/react"

import avatarImg from '../../../assets/img/avatar_20.jpg';
import CloseIcon from '@mui/icons-material/Close';
import icoWhatsapp from '../../../assets/img/ico_whatsapp.png';
import icoPhone from '../../../assets/img/ico_phone.png';

import './ChatBoot.scss';
import Container from '@mui/material/Container';

const ChatBoot = (props) => {

    const [scope, animate] = useAnimate();

    const [chatBoot,setChatBoot]  = useState({
        chatOpen: false,
    });

    useEffect(()=>{
                setChatBoot({
            chatOpen:false
        })
        animate([
            ['.messageBox1typingBox', { y: 3, opacity: 0 },{ duration:.1, ease: "easeInOut", delay: 0 } ],
            ['.messageBox1txt', { y: 0, opacity: 0 },{ duration:.1, ease: "easeIn", delay: 0 } ],
            ['.messageBox2typingBox', { y: 3, opacity: 0 },{ duration:.1, ease: "easeInOut", delay: 0 } ],
            ['.messageBox2txt', { y: 0, opacity: 0 },{ duration:.1, ease: "easeIn", delay: 0 } ],
            ['.messageOptionBox', { y: 3, opacity: 0 },{ duration:.1, ease: "easeIn", delay: 0 } ],
        ]);
    },[])



    const handleOpenChat = () =>{
        setChatBoot({
            chatOpen:true
        })
        animate([
            ['.bootBtn', { y: 5, opacity: 0 },{ duration:.1, ease: "easeIn", delay: 0 }],
            ['.chatCont', { y: -10, opacity: 1 },{ duration:.1, ease: "easeIn", delay: 0 } ],
            ['.messageBox1', { y: 0, opacity: 1 },{ duration:.1, ease: "easeIn", delay: .2 } ],
            ['.messageBox1typingBox', { y: 0, opacity: 1 },{ duration:.05, ease: "easeIn", delay: .3 } ],
            ['.messageBox1txt', { y: 0, opacity: 1 },{ duration:.1, ease: "easeIn", delay: .35 } ],
            ['.messageBox2', { y: 0, opacity: 1 },{ duration:.1, ease: "easeIn", delay: .2 } ],
            ['.messageBox2typingBox', { y: 0, opacity: 1 },{ duration:.05, ease: "easeIn", delay: .25 } ],
            ['.messageBox2txt', { y: 0, opacity: 1 },{ duration:.1, ease: "easeIn", delay: .3 } ],
            ['.messageOptionBox', { y: 0, opacity: 1 },{ duration:.1, ease: "easeIn", delay: .35 } ],

            
        ]);
    }

    const handleCloseChat = () =>{
        setChatBoot({
            chatOpen:false
        })
        animate([
            ['.bootBtn', { y: 0, opacity: 1 },{ duration:.1, ease: "easeOut", delay: 0.0 }],
            ['.chatCont', { y: 10, opacity: 0 },{ duration:.1, ease: "easeOut", delay: 0.0 }],
            ['.messageBox1', { y: 0, opacity: 0 },{ duration:.1, ease: "easeIn", delay: 0.0 } ],
            ['.messageBox2', { y: 0, opacity: 0 },{ duration:.1, ease: "easeIn", delay: 0.0 } ],
            ['.messageBox1typingBox', { y: 3, opacity: 0 },{ duration:.1, ease: "easeIn", delay: 0.0 } ],
            ['.messageBox1txt', { y: 0, opacity: 0 },{ duration:.1, ease: "easeIn", delay: 0.0 } ],
            ['.messageBox2typingBox', { y: 3, opacity: 0 },{ duration:.1, ease: "easeIn", delay: 0.0 } ],
            ['.messageBox2txt', { y: 0, opacity: 0 },{ duration:.1, ease: "easeIn", delay: 0.0 } ],
            ['.messageOptionBox', { y: 3, opacity: 0 },{ duration:.1, ease: "easeIn", delay: 0 } ],
        ]);
    }

    return (
        <div ref={scope} className='bootContent'>
            <Container>
                <div  className={chatBoot.chatOpen ? 'chatCont chatContAct' : 'chatCont'} >
                    <div className="chatBar">
                        <div className="ico">
                            <img src={avatarImg} alt=""/>
                        </div>
                        <span>
                            Saraí
                        </span>

                        <div onClick={handleCloseChat} className="chatClose">
                            <CloseIcon />
                        </div>
                    </div>
                    <div className="chatBox">
                        <div className='messageBox messageBox1'>
                            <figure>
                                <img src={avatarImg} alt=""/>
                            </figure>
                            <div className="txtBox">
                                <div className='typingBox messageBox1typingBox'>
                                    <span></span><span></span><span></span>
                                </div>
                                <div className='txt messageBox1txt'>
                                    {false &&
                                    <p><strong>¡Bienvenido!</strong> Estimado cliente, cuente conmigo para atender sus consultas o dudas.</p>
                                    }
                                    <p>
                                        <strong>¡Gracias por visitarnos!</strong> Si tienes dudas sobre un pedido o quieres saber más sobre nuestro catálogo, estamos listos para escucharte.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='messageBox messageBox2'>
                            <figure>
                                <img src={avatarImg} alt=""/>
                            </figure>
                            <div className="txtBox">
                                <div className='typingBox messageBox2typingBox' >
                                    <span></span><span></span><span></span>
                                </div>
                                <div className='txt messageBox2txt'>
                                    {false &&
                                        <p><strong>Déjame un mensaje</strong> para que pueda ayudarlo.</p>
                                    }
                                    <p>
                                        Para darte una atención más rápida y personalizada, haz clic en el botón de abajo y uno de nuestros colaboradores te atenderá directamente 
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='messageOptionBox'>
                            <a href="https://api.whatsapp.com/send?phone=51973889434" target="_blank" className="messageOption messageOption1">
                                <img src={icoWhatsapp} alt=""/>
                                <p>Déjenos un mensaje</p>
                            </a>
                            <a href="tel:+51943173048" className="messageOption messageOption2">
                                <img src={icoPhone} alt=""/>
                                <p>Contáctame por teléfono</p>
                            </a>
                        </div>
                    </div>
                </div>

                <div onClick={handleOpenChat} className='bootBtn'>
                    <div className="ico">
                        <img src={avatarImg} alt=""/>
                    </div>
                    <span>
                        ¿En qué podemos ayudarte?
                    </span>
                </div>


            </Container>
            
        </div>
    )
};

export default ChatBoot;
