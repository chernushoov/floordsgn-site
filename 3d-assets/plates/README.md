# 3D-плиты — drop-zone для GLB

Сюда Blender-художник кладёт готовые модели (по ТЗ `docs/BLENDER_3D_BRIEF_2026-05-19.md`).

## Ожидаемые файлы

```
terrazzo-cement.glb
terrazzo-multi.glb
terrazzo-epoxy.glb
microtopping.glb
rubber.glb
mma.glb
pu-cement.glb
epoxy.glb
comfortfloor.glb
decorative-concrete.glb
parquet.glb   (отложен, можно НЕ делать в первой итерации)
```

## Что делает заказчик после получения файла

1. Кладёт `<slug>.glb` сюда.
2. В `3d-assets/manifest.json` для соответствующего материала добавляет одно поле:
   ```json
   "glb_plate": "plates/<slug>.glb"
   ```
3. Деплоит — конфигуратор автоматически подменяет процедурную плиту на GLB.
4. Если в GLB баг — удаляет поле `glb_plate` из manifest → конфигуратор возвращается к процедурной плите (graceful fallback).

## Acceptance checklist (для каждого .glb)

См. раздел 9 в `docs/BLENDER_3D_BRIEF_2026-05-19.md`.

## Если GLB не загружается

- Открой https://gltf-viewer.donmccurdy.com и перетащи туда .glb — увидь рендер.
- Проверь имена мешей через https://threejs.org/editor/ (драг-н-дроп .glb → Outliner слева).
- Проверь что origin plateRoot в (0,0,0).
- Проверь что Y-up (Blender export setting).
