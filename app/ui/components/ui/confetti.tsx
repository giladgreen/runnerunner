import type { ReactNode } from "react";
import React, {
  createContext,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import type {
  GlobalOptions as ConfettiGlobalOptions,
  CreateTypes as ConfettiInstance,
  Options as ConfettiOptions,
} from "canvas-confetti";
import confetti from "canvas-confetti";
import { ButtonProps } from "./button";
import Button from '@/app/ui/client/Button';

type Api = {
  fire: (options?: ConfettiOptions) => void;
};

type Props = React.ComponentPropsWithRef<"canvas"> & {
  options?: ConfettiOptions;
  globalOptions?: ConfettiGlobalOptions;
  manualstart?: boolean;
  children?: ReactNode;
};

export type ConfettiRef = Api | null;

const ConfettiContext = createContext<Api>({} as Api);

const Confetti = forwardRef<ConfettiRef, Props>((props, ref) => {
  const {
    options,
    globalOptions = { resize: true, useWorker: true },
    manualstart = false,
    children,
    ...rest
  } = props;
  const instanceRef = useRef<ConfettiInstance | null>(null); // confetti instance

  const canvasRef = useCallback(
    // https://react.dev/reference/react-dom/components/common#ref-callback
    // https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
    (node: HTMLCanvasElement) => {
      if (node !== null) {
        // <canvas> is mounted => create the confetti instance
        if (instanceRef.current) return; // if not already created
        instanceRef.current = confetti.create(node, {
          ...globalOptions,
          resize: true,
        });
      } else {
        // <canvas> is unmounted => reset and destroy instanceRef
        if (instanceRef.current) {
          instanceRef.current.reset();
          instanceRef.current = null;
        }
      }
    },
    [globalOptions],
  );

  // `fire` is a function that calls the instance() with `opts` merged with `options`
  const fire = useCallback(
    (opts = {}) => instanceRef.current?.({ ...options, ...opts }),
    [options],
  );

  const api = useMemo(
    () => ({
      fire,
    }),
    [fire],
  );

  useImperativeHandle(ref, () => api, [api]);

  useEffect(() => {
    if (!manualstart) {
      fire();
    }
  }, [manualstart, fire]);

  return (
    <ConfettiContext.Provider value={api}>
      <canvas ref={canvasRef} {...rest} />
      {children}
    </ConfettiContext.Provider>
  );
});

interface ConfettiButtonProps extends ButtonProps {
  options?: ConfettiOptions &
    ConfettiGlobalOptions & { canvas?: HTMLCanvasElement };
  children?: React.ReactNode;
  onClick: ()=>void;
  particleCount:number;
}

function ConfettiButton({ options, children, ...props }: ConfettiButtonProps) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    props?.onClick();
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    if (props.particleCount > 0){
      if (props.particleCount  < 1000){
        confetti({
          ...options,
          particleCount: props.particleCount,
          origin: {
            x: x / window.innerWidth,
            y: y / window.innerHeight,
          },
        });
      }else{
        const end = Date.now() + 3500; // 3.5 seconds
        const colors = ["#a786ff",
          "#fd8bbc",
          "#eca184",
          "#ff7200",
          "#f8deb1",
          "#FFFF00"];

        const frame = () => {
          if (Date.now() > end) return;

          confetti({
            particleCount: 4,
            angle: 60,
            spread: 60,
            startVelocity: 70,
            origin: { x: 0, y: 0.5 },
            colors: colors,
          });
          confetti({
            particleCount: 4,
            angle: 120,
            spread: 60,
            startVelocity: 70,
            origin: { x: 1, y: 0.5 },
            colors: colors,
          });

          confetti({
            particleCount: 5,
            origin: {
              x: 0.5,
              y: 1,
            },
          });

          requestAnimationFrame(frame);
        };

        frame();
      }
    }


  };

  return <Button type="submit" onClick={handleClick} id={'id'}>
    {children}
  </Button>

}

Confetti.displayName = "Confetti";

export { Confetti, ConfettiButton };

export default Confetti;
