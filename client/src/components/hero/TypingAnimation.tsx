"use client"

import { useState, useEffect, useRef } from "react"

interface TypingAnimationProps {
  phrases: string[]
  typingSpeed?: number
  deletingSpeed?: number
  blinkDuration?: number 
}

export function TypingAnimation({
  phrases,
  typingSpeed = 100,
  deletingSpeed = 100,
  blinkDuration = 600,
}: TypingAnimationProps) {
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isWaitingBeforeDelete, setIsWaitingBeforeDelete] = useState(false)
  const [cursorVisibleDuringWait, setCursorVisibleDuringWait] = useState(true)

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const blinkTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const blinkCountRef = useRef(0)

  useEffect(() => {
    if (isWaitingBeforeDelete) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
      return
    }

    const currentPhrase = phrases[phraseIndex]

    const handleTimeout = () => {
      if (isDeleting) {

        if (currentText.length > 0) {
          setCurrentText(currentPhrase.substring(0, currentText.length - 1))
          typingTimeoutRef.current = setTimeout(handleTimeout, deletingSpeed)
        } else {
          setIsDeleting(false)
          setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length)

          typingTimeoutRef.current = setTimeout(handleTimeout, typingSpeed)
        }
      } else {
        if (currentText.length < currentPhrase.length) {
          setCurrentText(currentPhrase.substring(0, currentText.length + 1))
           typingTimeoutRef.current = setTimeout(handleTimeout, typingSpeed)
        } else {
          setIsWaitingBeforeDelete(true)
        }
      }
    }

    const initialDelay = isDeleting ? deletingSpeed : typingSpeed;
    typingTimeoutRef.current = setTimeout(handleTimeout, initialDelay)

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [currentText, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, isWaitingBeforeDelete])


  useEffect(() => {
    if (!isWaitingBeforeDelete) {
       setCursorVisibleDuringWait(true);
       if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);
       blinkCountRef.current = 0;
      return;
    }

    const performBlinkStep = () => {
        blinkCountRef.current += 1;
        setCursorVisibleDuringWait((prev) => !prev);

        if (blinkCountRef.current < 6) { 
             blinkTimeoutRef.current = setTimeout(performBlinkStep, blinkDuration);
        } else {
             blinkCountRef.current = 0; 
             setIsWaitingBeforeDelete(false); 
             setIsDeleting(true); 
        }
    };

    setCursorVisibleDuringWait(true); 
    blinkCountRef.current = 0;
    blinkTimeoutRef.current = setTimeout(performBlinkStep, blinkDuration);


    return () => {
      if (blinkTimeoutRef.current) {
        clearTimeout(blinkTimeoutRef.current)
      }
    }
  }, [isWaitingBeforeDelete, blinkDuration, phraseIndex]) 


  const showCursor = !isWaitingBeforeDelete || cursorVisibleDuringWait;

  return (
    <div className="inline-flex items-center h-6"> 
      <span>{currentText}</span>
      <span
        className={`w-0.5 h-4 bg-black dark:bg-white ml-0.5 ${showCursor ? "opacity-100" : "opacity-0"} ${isWaitingBeforeDelete ? 'transition-opacity' : ''} duration-100`}
      ></span>
    </div>
  )
}
