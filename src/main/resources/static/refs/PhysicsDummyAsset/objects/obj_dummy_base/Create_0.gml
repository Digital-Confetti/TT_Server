body_object	= obj_dummy_body;
stem_object	= obj_dummy_stem;
spawn_layer	= "Instances";

// Create Stem
stem = instance_create_layer(x, y - (sprite_get_height(sprite_index) * 0.5), spawn_layer, stem_object);
stem.image_xscale = image_xscale;

// Create Body
body = instance_create_layer(stem.x, stem.y - (sprite_get_height(stem.sprite_index) * 0.75), spawn_layer, body_object);
body.image_xscale = image_xscale;
body.depth = stem.depth - 1;

// Connect Base to Stem
physics_joint_weld_create(id, stem, stem.x, stem.y, 0, 0, 0, false);

// Connect Body to Stem
physics_joint_weld_create(stem, body, body.x, body.y, 0, 0, 0, false);

// Setup Associates
stem.body = body;
stem.base = id;
body.stem = stem;
body.base = id;