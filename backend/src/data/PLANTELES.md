Planteles consultados en Transfermarkt el 04/11/2026: 16 clubes, 462 registros.
Las URL exactas de cada plantilla se conservan en planteles-transfermarkt.json;
son las enlazadas por la página de liga proporcionada por el usuario.
Transfermarkt las identifica internamente con saison_id/2025: no se ha sustituido
esa referencia por otra temporada ni se garantiza su actualización futura.

El nombre completo de Rodolfo se verificó en https://www.transfermarkt.es/rodolfo/profil/spieler/102227.

Se copian nombres y posición de juego, agrupados por club. Las posiciones se
adaptan a GOLERO, DEFENSOR, MEDIOCAMPISTA y DELANTERO. Los nombres públicos se
separan en primer término y términos restantes; no son nombres legales completos.

Todos los datos generados de nacimiento, nacionalidad, altura, pie hábil,
estadísticas 2024–2026 y período en el club son FICTICIOS. No se inventan lesiones
ni transferencias entre clubes. No representan el rendimiento o biografía real.

npm.cmd run seed:planteles agrega los jugadores sin borrar datos existentes y
omite nombres completos ya presentes (ignorando tildes y mayúsculas). No intenta
equiparar apodos con nombres legales. Puede repetirse sin duplicar sus registros.
npm.cmd run seed sigue reiniciando toda la base y carga también estos planteles.
