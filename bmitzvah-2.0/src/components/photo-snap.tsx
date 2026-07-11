import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

const EASE: [number, number, number, number] = [0.25, 1, 0.5, 1]

// A snapshot-style photo card: white border, slight tilt, pops in like a
// print dropped on a table and straightens on hover. Real kids and families
// (from the product research pack) next to the illustrated scenes keep the
// journey feeling like something that actually happens.
export function PhotoSnap({
  src,
  alt,
  tilt = -3,
  delay = 0,
  className,
}: {
  src: string
  alt: string
  tilt?: number
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, rotate: 0, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, rotate: tilt, scale: 1 }}
      whileHover={{ rotate: 0, y: -4 }}
      transition={{ duration: 0.35, ease: EASE, delay }}
      className={cn(
        'shrink-0 overflow-hidden rounded-2xl border-4 border-background bg-background shadow-md ring-1 ring-border',
        className,
      )}
    >
      <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
    </motion.div>
  )
}

// A row of overlapping round faces — the "real people are here" signal.
export function FaceCluster({
  photos,
  className,
}: {
  photos: readonly { src: string; alt: string }[]
  className?: string
}) {
  return (
    <div className={cn('flex -space-x-3', className)}>
      {photos.map((photo, index) => (
        <motion.img
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: EASE, delay: index * 0.08 }}
          className="size-12 rounded-full border-2 border-background object-cover"
        />
      ))}
    </div>
  )
}
