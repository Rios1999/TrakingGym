import json

def json_to_sql(json_file_path, table_name='"Ejercicios"'):
    try:
        with open(json_file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # 1. Comando para crear la tabla + Columna peso_corporal
        setup_sql = f"""-- Crear la tabla si no existe
CREATE TABLE IF NOT EXISTS public.{table_name} (
    nombre TEXT PRIMARY KEY,
    categoria TEXT,
    peso_corporal BOOLEAN,
    sinonimos TEXT[],
    factor_carga FLOAT8,
    mapeo_anatomico JSONB
);

-- Limpiar tabla antes de insertar para evitar duplicados
TRUNCATE TABLE public.{table_name};

INSERT INTO public.{table_name} (nombre, categoria, peso_corporal, sinonimos, factor_carga, mapeo_anatomico)
VALUES 
"""
        rows = []
        for item in data:
            # Escapar comillas simples
            nombre = item['nombre'].replace("'", "''")
            categoria = item['categoria']
            
            # Nuevo atributo: peso_corporal (se convierte a string para SQL: 'true'/'false')
            # Usamos .get() por seguridad, por defecto será false
            peso_corporal = str(item.get('peso_corporal', False)).lower()
            
            sinonimos_list = ", ".join([f"'{s.replace("'", "''")}'" for s in item['sinonimos']])
            sinonimos_sql = f"ARRAY[{sinonimos_list}]"
            
            factor_carga = item['factor_carga']
            mapeo_json = json.dumps(item['mapeo_anatomico'])
            
            # Formatear la fila con el nuevo orden
            row = f"('{nombre}', '{categoria}', {peso_corporal}, {sinonimos_sql}, {factor_carga}, '{mapeo_json}')"
            rows.append(row)

        # Unir todo
        full_sql = setup_sql + ",\n".join(rows) + ";"
        
        # Guardar en el archivo .sql
        with open('importar_ejercicios.sql', 'w', encoding='utf-8') as f:
            f.write(full_sql)
        
        print(f"✅ ¡Todo listo! Se ha generado 'importar_ejercicios.sql'")
        print(f"📦 Se han procesado {len(data)} ejercicios con soporte para RM de autocarga.")

    except FileNotFoundError:
        print(f"❌ Error: No se encontró el archivo '{json_file_path}'")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")

# Ejecución
json_to_sql('bbdd_ejercicio.json')