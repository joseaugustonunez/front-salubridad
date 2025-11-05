import { FaFacebookF, FaInstagram, FaTwitter, FaTiktok } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#254A5D] via-[#337179] to-[#254A5D] text-white rounded-t-2xl overflow-hidden">
      {/* franja superior fina para mantener continuidad con el navbar */}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          {/* Logo y texto - alineado como en el navbar */}
          <div className="flex items-center gap-4">
            <img src="/escudo.png" alt="TuMarca" className="w-12 h-auto" />
            <div>
              <h3 className="text-lg font-bold text-white">Amarilis</h3>
              <p className="text-sm text-[#CFEAF0]">
                Sabor auténtico, experiencias únicas
              </p>
            </div>
          </div>

          {/* Navegación compacta al centro */}
          <nav className="flex flex-wrap justify-center gap-3 text-sm">
            <a href="/" className="text-[#E6F7F9] hover:text-white px-2">
              Inicio
            </a>
            <a
              href="/establecimientos"
              className="text-[#E6F7F9] hover:text-white px-2"
            >
              Establecimientos
            </a>
            <a
              href="/promociones"
              className="text-[#E6F7F9] hover:text-white px-2"
            >
              Promociones
            </a>
            <a href="/top" className="text-[#E6F7F9] hover:text-white px-2">
              Top
            </a>
            <a
              href="/asociate"
              className="px-3 py-1 rounded-full bg-gradient-to-r from-[#37c6a6] to-[#49C581] text-white hover:opacity-95 transition"
            >
              ¡Asóciate!
            </a>
          </nav>

          {/* Redes sociales - efecto de un solo color al hover */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-[#337179] hover:bg-[#49C581] hover:text-white transition"
              aria-label="Facebook"
            >
              <FaFacebookF className="text-xs" />
            </a>
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-[#337179] hover:bg-[#49C581] hover:text-white transition"
              aria-label="Instagram"
            >
              <FaInstagram className="text-xs" />
            </a>
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-[#337179] hover:bg-[#49C581] hover:text-white transition"
              aria-label="Twitter"
            >
              <FaTwitter className="text-xs" />
            </a>
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-[#337179] hover:bg-[#49C581] hover:text-white transition"
              aria-label="Tiktok"
            >
              <FaTiktok className="text-xs" />
            </a>
          </div>
        </div>

        <div className="mt-6 border-t border-[#2C6B73] pt-4 text-center text-xs text-[#CFEAF0]">
          © 2025 TuMarca · Hecho con pasión
        </div>
      </div>
    </footer>
  );
}

export default Footer;
