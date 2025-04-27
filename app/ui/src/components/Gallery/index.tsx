'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import { ScrollArea } from '@radix-ui/themes';
import Image from 'next/image';
import { useMemo, useState } from 'react';

import { cn } from '@/utils/cn';

interface Props {
   className?: string;
   images: string[];
}

export default function Gallery(props: Props) {
   const { images, className } = props;
   const [idx, setIdx] = useState(0);

   const imageUrls = useMemo(
      () =>
         images.map((i) =>
            i.startsWith('/')
               ? `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}${i}`
               : i,
         ),
      [images],
   );

   const inc = () => {
      setIdx((i) => (i === images.length - 1 ? 0 : i + 1));
   };

   const dec = () => {
      setIdx((i) => (i === 0 ? images.length - 1 : i - 1));
   };

   return (
      <div className={cn('flex flex-col gap-3 select-none', className)}>
         <div className="relative flex h-96 w-full items-center justify-center">
            <div
               className="absolute top-0 bottom-0 left-0 flex cursor-pointer items-center px-4 duration-100 hover:bg-white/20"
               onClick={dec}
            >
               <ArrowLeftIcon />
            </div>
            <Image
               src={imageUrls[idx]}
               alt={imageUrls[idx]}
               fetchPriority="high"
               priority={true}
               loading="eager"
               fill={true}
               sizes="all"
               className="-z-10 object-cover"
            />
            <div
               className="absolute top-0 right-0 bottom-0 flex cursor-pointer items-center px-4 duration-100 hover:bg-white/20"
               onClick={inc}
            >
               <ArrowRightIcon />
            </div>
         </div>

         <ScrollArea className="w-full max-w-full">
            <div className="flex h-fit gap-3">
               {imageUrls.map((src, i) => (
                  <div
                     key={src}
                     className="relative aspect-video w-52 cursor-pointer"
                     onClick={() => setIdx(i)}
                  >
                     <Image
                        src={src}
                        alt={src}
                        fetchPriority="low"
                        loading="lazy"
                        sizes="all"
                        className="flex-1 object-cover object-center"
                        fill={true}
                     />
                  </div>
               ))}
            </div>
         </ScrollArea>
      </div>
   );
}
