import Lottie from 'react-lottie';
import { animationDefaultOptions } from '@/lib/utils'; // Ensure this is the correct path

const EmptyChatContainer = () => {
  return (
    <div className="flex-1 md:bg-[#fefeff] md:flex flex-col justify-center items-center hidden duration-1000 transition-all">
      <Lottie
        options={animationDefaultOptions}
        height={200}
        width={200}
        isClickToPauseDisabled={true}
      />
      <div className='text-opacity-80 flex flex-col gap-5 items-center lg:text-4xl text-3xl transition-all duration-300 text-center'>
        <h3 className='poppins-semibold text-[#FFC876]'>
          Hi <span className='text-[#FFC876]'> ! </span>
          welcome <span className='text-[#FFC876]'> to </span><span className='text-[#FFC876]'>
            Co.Chatter
          </span> Chat App<span className='text-[#FFC876]'>
            .
          </span>
        </h3>
      </div>
    </div>
  );
};

export default EmptyChatContainer;
