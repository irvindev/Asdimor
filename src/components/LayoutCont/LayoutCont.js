import React,{useEffect} from "react";

import { useLocation  } from "react-router";

import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";

import './LayoutCont.scss';

const animationConfiguration = {
    initial: { y: -10, opacity: 0 },
    animate:{ y: 0, opacity: 1 },
    exit: { y: 10, opacity: 0 },
    transition: { duration: 0.4 }
};

const sections = {
  hidden: {
    x: '-100%',
    //opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};


const LayoutCont = ({children,keyPage}) => {

  let params = useLocation ();
  
  useEffect(()=>{
    window.scrollTo(0, 0);
  },[])

  return (

    <AnimatePresence mode="wait" >
        <motion.div
            key={params.key ? params.key :params.key}
            variants={animationConfiguration}
            initial="initial"
            animate="animate"
            exit="exit"
            transition="transition"
        >
            {children}
        </motion.div>
    </AnimatePresence >
  )
};

export default LayoutCont;
