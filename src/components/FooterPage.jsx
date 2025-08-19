import { FaFacebookF, FaInstagram, FaTwitter, FaTiktok } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-[#254A5D] text-white pt-10 pb-6">
      <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
        
        {/* Marca / Logo */}
        <div>
          <h2 className="text-2xl font-bold text-[#49C5B1] mb-4">TuMarca</h2>
          <p className="text-sm text-gray-300">
            Conectamos a los mejores establecimientos contigo. Descubre, califica y comparte.
          </p>
        </div>

        {/* Navegación */}
        <div>
          <h3 className="text-xl font-semibold text-[#49C5B1] mb-4">Enlaces</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-[#49C5B1] transition">Inicio</a></li>
            <li><a href="#" className="hover:text-[#49C5B1] transition">Establecimientos</a></li>
            <li><a href="#" className="hover:text-[#49C5B1] transition">Promociones</a></li>
            <li><a href="#" className="hover:text-[#49C5B1] transition">Perfil</a></li>
          </ul>
        </div>

        {/* Redes sociales */}
        <div>
          <h3 className="text-xl font-semibold text-[#49C5B1] mb-4">Síguenos</h3>
          <div className="flex space-x-4">
            <a href="#" className="bg-[#337179] hover:bg-[#49C5B1] p-3 rounded-full transition">
              <FaFacebookF />
            </a>
            <a href="#" className="bg-[#337179] hover:bg-[#49C5B1] p-3 rounded-full transition">
              <FaInstagram />
            </a>
            <a href="#" className="bg-[#337179] hover:bg-[#49C5B1] p-3 rounded-full transition">
              <FaTwitter />
            </a>
            <a href="#" className="bg-[#337179] hover:bg-[#49C5B1] p-3 rounded-full transition">
              <FaTiktok />
            </a>
          </div>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="mt-10 border-t border-[#337179] pt-4 text-sm text-center text-gray-400">
        © 2025 TuMarca. Todos los derechos reservados.
      </div>
    </footer>
  );
}

export default Footer;
