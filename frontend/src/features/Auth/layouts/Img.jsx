export const Img = () => {

    return (
      <div className="w-1/2 h-screen flex items-center justify-center">
        <img 
        src="/imgs/login.jpg" 
        alt="" 
        className="object-cover w-full h-full"
        style={{ maxWidth: '100vw', maxHeight: '100vh' }}  
        />
      </div>
    );
}