export const Img = () => {

    return (
      <div className="absolute lg:relative w-full lg:w-1/2 h-screen">
        <img 
        src="/imgs/login.jpg" 
        alt="" 
        className="object-cover w-full h-full"
        style={{ maxWidth: '100vw', maxHeight: '100vh' }}  
        />
      </div>
    );
}