import React, { useEffect, useState } from 'react';
import { Image } from '@uniwebcms/core-components';
import { twJoin } from '@uniwebcms/module-sdk';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function LogoCarousel(props) {
    const { block, page } = props;
    const { title, images } = block.getBlockContent();
    const { logo_size = 'medium' } = block.getBlockProperties();

    const [sliderToShow, setSliderToShow] = useState(5);

    useEffect(() => {
        // Adjust the number of slides to show based on screen width
        const updateSliderToShow = () => {
            const width = window.innerWidth;
            if (width >= 1280) {
                if (logo_size === 'large') {
                    setSliderToShow(5);
                } else if (logo_size === 'medium') {
                    setSliderToShow(6);
                } else if (logo_size === 'small') {
                    setSliderToShow(7);
                }
            } else if (width >= 1024) {
                if (logo_size === 'large') {
                    setSliderToShow(4);
                } else if (logo_size === 'medium') {
                    setSliderToShow(5);
                } else if (logo_size === 'small') {
                    setSliderToShow(6);
                }
            } else if (width >= 768) {
                if (logo_size === 'large') {
                    setSliderToShow(3);
                } else if (logo_size === 'medium') {
                    setSliderToShow(4);
                } else if (logo_size === 'small') {
                    setSliderToShow(5);
                }
            } else if (width >= 640) {
                setSliderToShow(2);
                if (logo_size === 'large') {
                    setSliderToShow(2);
                } else if (logo_size === 'medium') {
                    setSliderToShow(3);
                } else if (logo_size === 'small') {
                    setSliderToShow(4);
                }
            } else {
                if (logo_size === 'large') {
                    setSliderToShow(1);
                } else if (logo_size === 'medium') {
                    setSliderToShow(2);
                } else if (logo_size === 'small') {
                    setSliderToShow(3);
                }
            }
        };

        updateSliderToShow();
        window.addEventListener('resize', updateSliderToShow);

        return () => {
            window.removeEventListener('resize', updateSliderToShow);
        };
    }, [logo_size, images.length]);

    const carouselItems = images.map((image, index) => (
        <div key={index} className="w-full">
            <Image
                profile={page.getPageProfile()}
                {...image}
                className={twJoin(
                    'mx-auto object-contain',
                    logo_size === 'large' ? 'h-24 w-48' : '',
                    logo_size === 'medium' ? 'h-[72px] w-36' : '',
                    logo_size === 'small' ? 'h-12 w-24' : ''
                )}
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
