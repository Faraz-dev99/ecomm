import React, { useState, useEffect } from 'react';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import '../App.css';

const Slider = ({data}) => {
  //console.log("why is this ",data)
  const slides = [
    {
      id: 1,
      name: 'real me',
      content: 'Slide one is here',
      color: 'bg-red-800',
      img: 'https://image01.realme.net/general/20230512/1683873836923.png?width=1440&height=1440&size=544990'
    },
    {
      id: 2,
      name: 'hp laptop',
      content: 'Slide two is here',
      color: 'bg-blue-800',
      img: 'https://m.media-amazon.com/images/I/71Ckr4dFaQL.jpg'
    },
    {
      id: 3,
      name: 'samsung 21',
      content: 'Slide three is here',
      color: 'bg-green-800',
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMySlWxE3HujgwGR1ajC25N7R9yEsSS2BOQg&s'
    },
    
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds (5000 milliseconds)

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [currentSlide]);

  const nextSlide = () => {
    if(data.length>0)
    setCurrentSlide((prevSlide) => (prevSlide === data.length - 1 ? 0 : prevSlide + 1));
  else
  setCurrentSlide((prevSlide) => (prevSlide === slides.length - 1 ? 0 : prevSlide + 1));
  };

  const prevSlide = () => {
    if(data.length>0)
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? data.length - 1 : prevSlide - 1));
  else
  setCurrentSlide((prevSlide) => (prevSlide === slides.length - 1 ? 0 : prevSlide + 1));
  };

  const [touchStartX, setTouchStartX] = useState(null);
  const [mouseStartX, setMouseStartX] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (touchStartX === null) return;
    const touchEndX = e.touches[0].clientX;
    const touchDifference = touchStartX - touchEndX;

    if (touchDifference > 50) {
      nextSlide(); // Swipe left
      setTouchStartX(null); // Reset touch start position
    } else if (touchDifference < -50) {
      prevSlide(); // Swipe right
      setTouchStartX(null); // Reset touch start position
    }
  };

  const handleMouseDown = (e) => {
    setMouseStartX(e.clientX);
  };

  const handleMouseUp = (e) => {
    if (mouseStartX === null) return;
    const mouseEndX = e.clientX;
    const mouseDifference = mouseStartX - mouseEndX;

    if (mouseDifference > 50) {
      nextSlide(); // Slide to next on mouse drag left
    } else if (mouseDifference < -50) {
      prevSlide(); // Slide to previous on mouse drag right
    }
    setMouseStartX(null); // Reset mouse start position
  };

  return (
    <div
      className="slider select-none flex justify-center w-full items-center max-md:h-[450px] md:h-[560px] relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div className="slides relative w-full h-full">
        {
          (data.length>0)?data.map((e,i)=>{
            return <div
            key={e._id}
            style={{ transition: 'opacity 1s ease' }}
            className={`slide absolute left-0 top-0 py-8 gap-4 h-full w-full lg:text-white flex max-lg:flex-col justify-center items-center opacity-0 ${i === currentSlide ? 'opacity-100' : ''}`}
          >
            <div className="flex flex-col px-6 gap-2 rounded-lg justify-center items-center lg:w-2/5 lg:h-full lg:bg-sky-500 md:w-full max-lg:h-2/5 slantBox">
              <h1 className="md:text-5xl font-semibold  relative md:z-50 max-md:text-4xl">{e.name}</h1>
              <h2 className="text-base max-md:font-light md:text-slate-300 truncate max-w-40 text-center">{e.description}</h2>
              <button className=' px-3 py-2 mt-2 bg-sky-500 lg:bg-slate-200 text-slate-900 rounded-md'>Buy Now</button>
            </div>
            <div className="flex justify-center items-center md:w-3/5 md:h-full max-md:h-[270px] max-md:w-[220px]">
              <img src={e.images[0].secure_url} alt="img" className="max-md:w-full select-none drag-none rounded-lg md:w-3/5 max-md:h-full md:h-full max-lg:h-3/5 " />
            </div>
          </div>
          }):slides.map((slide, index) => (
            <div
              key={slide.id}
              style={{ transition: 'opacity 1s ease' }}
              className={`slide absolute left-0 top-0 py-8 gap-4 h-full w-full lg:text-white flex max-lg:flex-col justify-center items-center opacity-0 ${index === currentSlide ? 'opacity-100' : ''}`}
            >
              <div className="flex flex-col px-6 gap-2 rounded-lg justify-center items-center lg:w-2/5 lg:h-full lg:bg-sky-500 md:w-full max-lg:h-2/5 slantBox">
                <h1 className="md:text-5xl font-semibold  relative md:z-50 max-md:text-4xl">{slide.name}</h1>
                <h2 className="text-base max-md:font-light md:text-slate-300 ">{slide.content}</h2>
                {/* <button className=' px-3 py-2 mt-2 bg-sky-500 lg:bg-slate-200 text-slate-900 rounded-md'>Buy Now</button> */}
              </div>
              <div className="flex justify-center items-center md:w-3/5 md:h-full max-md:h-[270px] max-md:w-[220px]">
                <img src={slide.img} alt="img" className="max-md:w-full select-none drag-none rounded-lg md:w-3/5 max-md:h-full md:h-full max-lg:h-3/5 " />
              </div>
            </div>
          ))
        }
        

        {/* Buttons visible only on desktop */}
        
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
            <button
              onClick={prevSlide}
              className="w-8 h-8 max-lg:rounded-full bg-sky-600/20 lg:bg-sky-500/75 text-white rounded-md flex items-center justify-center shadow-md hover:bg-sky-500"
            >
              <NavigateBeforeIcon />
            </button>
            <button
              onClick={nextSlide}
              className="w-8 h-8 max-lg:rounded-full bg-sky-600/20 lg:bg-sky-500/75 text-white rounded-md flex items-center justify-center shadow-md hover:bg-sky-500"
            >
              <NavigateNextIcon />
            </button>
          </div>
        
      </div>
    </div>
  );
};

export default Slider;
