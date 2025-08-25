import React, { useEffect, useState } from 'react';
import { Image } from '@uniwebcms/core-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function LogoCarousel(props) {
    const { block, page } = props;
    const { title, images } = block.getBlockContent();

    const [sliderToShow, setSliderToShow] = useState(5);

    useEffect(() => {
        // Adjust the number of slides to show based on screen width
        const updateSliderToShow = () => {
            const width = window.innerWidth;
            if (width >= 1280) {
                setSliderToShow(5);
            } else if (width >= 1024) {
                setSliderToShow(4);
            } else if (width >= 768) {
                setSliderToShow(3);
            } else if (width >= 640) {
                setSliderToShow(2);
            } else {
                setSliderToShow(1);
            }
        };

        updateSliderToShow();
        window.addEventListener('resize', updateSliderToShow);

        return () => {
            window.removeEventListener('resize', updateSliderToShow);
        };
    }, [images.length]);

    const carouselItems = images.map((image, index) => (
        <div key={index} className="w-full">
            <Image
                profile={page.getPageProfile()}
                {...image}
                className="mx-auto h-16 w-44 object-contain"
            />
        </div>
    ));

    return (
        <div className="px-6 py-12 overflow-hidden">
            <div className="text-center">
                <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl">{title}</h2>
            </div>

            <div className="mt-12 relative overflow-hidden">
                <Slider
                    {...{
                        dots: false,
                        infinite: true,
                        slidesToShow: sliderToShow,
                        slidesToScroll: 1,
                        autoplay: true,
                        speed: 2000,
                        autoplaySpeed: 2000,
                        cssEase: 'linear',
                    }}
                >
                    {carouselItems}
                </Slider>
            </div>
        </div>
    );
}
