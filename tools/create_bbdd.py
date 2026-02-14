import json

def json_to_sql(json_file_path, table_name='"Ejercicios"'):
    try:
        with open(json_file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # 1. Comando para crear la tabla si no existe + Limpiar datos
        setup_sql = f"""-- Crear la tabla si no existe
CREATE TABLE IF NOT EXISTS public.{table_name} (
    nombre TEXT PRIMARY KEY,
    categoria TEXT,
    sinonimos TEXT[],
    factor_carga FLOAT8,
    mapeo_anatomico JSONB
);

-- Limpiar tabla antes de insertar para evitar duplicados
TRUNCATE TABLE public.{table_name};

INSERT INTO public.{table_name} (nombre, categoria, sinonimos, factor_carga, mapeo_anatomico)
VALUES 
"""
        rows = []
        for item in data:
            # Escapar comillas simples en nombres y sinónimos
            nombre = item['nombre'].replace("'", "''")
            categoria = item['categoria']
            
            sinonimos_list = ", ".join([f"'{s.replace("'", "''")}'" for s in item['sinonimos']])
            sinonimos_sql = f"ARRAY[{sinonimos_list}]"
            
            factor_carga = item['factor_carga']
            mapeo_json = json.dumps(item['mapeo_anatomico'])
            
            # Formatear la fila
            row = f"('{nombre}', '{categoria}', {sinonimos_sql}, {factor_carga}, '{mapeo_json}')"
            rows.append(row)

        # Unir todo
        full_sql = setup_sql + ",\n".join(rows) + ";"
        
        # Guardar en el archivo .sql
        with open('importar_ejercicios.sql', 'w', encoding='utf-8') as f:
            f.write(full_sql)
        
        print(f"✅ ¡Todo listo! Se ha generado 'importar_ejercicios.sql'")
        print(f"📦 Se han procesado {len(data)} ejercicios.")

    except FileNotFoundError:
        print(f"❌ Error: No se encontró el archivo '{json_file_path}'")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")

# Ejecución con tu archivo específico
json_to_sql('bbdd_ejercicio.json')