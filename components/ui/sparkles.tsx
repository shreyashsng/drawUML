"use client";
import React, { useId } from "react";
import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const SparklesCore = () => {
  const [init, setInit] = useState(false);
  
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const generatedId = useId();

  return (
    <div className="relative h-[40vh] -mt-20">
      <motion.div 
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
        className="h-full w-full absolute inset-0"
      >
        {init && (
          <Particles
            id={generatedId}
            className="h-full w-full"
            options={{
              background: {
                color: {
                  value: "transparent",
                },
              },
              fullScreen: {
                enable: false,
                zIndex: 1,
              },
              particles: {
                color: {
                  value: "#94A3B8",
                },
                move: {
                  enable: true,
                  speed: { min: 0.1, max: 1 },
                },
                number: {
                  value: 100,
                },
                opacity: {
                  value: { min: 0.1, max: 0.5 },
                  animation: {
                    enable: true,
                    speed: 1,
                  },
                },
                size: {
                  value: { min: 1, max: 3 },
                },
                shape: {
                  type: "circle",
                },
              },
            }}
          />
        )}
      </motion.div>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-medium text-gray-700 mb-4">
            Ready to transform your ideas into UML diagrams?
          </h1>
          <p className="text-gray-500">
            Start creating with AI-powered diagram generation
          </p>
        </motion.div>
      </div>
    </div>
  );
}; 