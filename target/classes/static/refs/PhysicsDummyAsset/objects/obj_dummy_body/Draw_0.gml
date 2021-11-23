if (hit)
	shader_set(shader_white);
else
	shader_reset();
	
draw_self();
shader_reset();