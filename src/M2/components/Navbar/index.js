import React from 'react';
import { Icon, Image, getPageProfile, Link, twJoin } from '@uniwebcms/module-sdk';
import { LuMenu } from 'react-icons/lu';

export default function navbar(props) {
    const { block, website } = props;
    const { themeName } = block;

    const { banner, icons, images: blockImgs } = block.getBlockContent();

    const { sign_up_link = '' } = block.getBlockProperties();

    const icon = icons[0];
    const logoImg = [banner, ...blockImgs]
        .filter(Boolean)
        .find((img) => img.caption === `logo-${themeName.split('__')[1]}`);
    const linkGroups = block.getBlockLinks({ nested: true, grouped: true });

    const logo = icon ? (
        <Icon icon={firstIcon} className="w-full h-full" />
    ) : logoImg ? (
        <Image profile={getPageProfile()} {...logoImg} className="w-full h-full object-contain" />
    ) : null;

    return (
        <>
            {/* Desktop Navbar */}
            <nav className="p-6 w-full hidden xl:flex fixed z-[1000] left-[50%] transform -translate-x-[50%] h-20 rounded-xl backdrop-blur-sm mt-[10px] max-w-[1400px] bg-neutral-50">
                <div className="flex gap-6 items-center w-full">
                    {/* Logo */}
                    <div className="flex-shrink-0 w-24 mr-6">
                        <Link to="">{logo}</Link>
                    </div>
                    {/* Links */}
                    <ul className="flex gap-6 items-center w-full">
                        {linkGroups.map((links, gIndex) => {
                            return (
                                <React.Fragment key={gIndex}>
                                    {links.map((link, lIndex) => {
                                        const { label, route, child_items, hasData } = link;
                                        return (
                                            <li
                                                key={lIndex}
                                                className={twJoin(
                                                    'group relative',
                                                    lIndex === 0 && gIndex > 0 && 'ml-auto'
                                                )}
                                            >
                                                <Link
                                                    to={route}
                                                    className="flex gap-2 cursor-pointer hover:bg-text-color-10 rounded-md py-1 px-2 font-medium"
                                                >
                                                    <span>{label}</span>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </React.Fragment>
                            );
                        })}
                        {sign_up_link && (
                            <li>
                                <Link
                                    to={sign_up_link}
                                    target="_blank"
                                    className="block bg-black hover:bg-[#3C3C3C] text-white py-2 px-5 h-[44px] max-w-[105px] rounded-xl font-medium leading-[1.8]"
                                >
                                    {website.localize({
                                        en: 'Sign up',
                                        fr: "S'inscrire",
                                        es: 'Regístrate',
                                        zh: '注册',
                                    })}
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </nav>
            {/* Mobile Navbar */}
            <nav className="px-5 pt-16 block w-full xl:hidden relative z-10">
                <div className="flex gap-6 items-center w-full justify-between fixed left-0 top-0 px-4 sm:px-6 py-4 bg-white">
                    {/* Logo */}
                    <div className="flex-shrink-0 w-24">
                        <Link to="">{logo}</Link>
                    </div>
                    <div className="flex items-center gap-4">
                        {sign_up_link && (
                            <Link
                                to={sign_up_link}
                                target="_blank"
                                className="bg-black text-white py-2 px-5 h-[44px] max-w-[105px] rounded-xl grid place-content-center font-medium"
                            >
                                {website.localize({
                                    en: 'Sign up',
                                    fr: "S'inscrire",
                                    es: 'Regístrate',
                                    zh: '注册',
                                })}
                            </Link>
                        )}
                        <button className="relative">
                            <LuMenu className="h-[26px] w-[26px] text-text-color" />
                        </button>
                    </div>
                </div>
            </nav>
        </>
    );
}
