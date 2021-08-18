+++
title = "CSC 461: Computer Graphics"
[extra]
teacher = "Dr. Ben Watson"
+++

# Administrivia

* Primarily using WebGL via JavaScript.
* Website: <https://cgclass.csc.ncsu.edu/>

# History

* Brunelleschi (1425): First to invent/define linear perspective.
* Issac Newton (~1675): Discovered white light is a combo of light of all
  color. Created color wheel.
* Thomas Young, Herman von Helmholtz, James Maxwell (1800s): Improved color
  theory and created first color photograph/display.
* Ewald Hering (1800s): Theorized that human vision perception resulted in
  Newton's color wheel and opposing colors.
* Leo Horwich & Dorothea Jameson (1950s): Found evidence for Haring's theory in
  the brain.
* Pierre Bézier (1950s): Found an elegant mathematical way to describe
  arbitrary curves.
* Jack Bresenham (1960s): Efficiently solved problem of representing sloped
  lines on rasterized 2D displays. That is, he used only integer addition and
  subtraction.
* David Evans: Founded computer science department at University of Utah and
  hired Ivan Sutherland. Created early rasterization pipeline.
* Ivan Sutherland (1960s): Developed first drawing program while grad student
  at MIT. Had undo and rubber-banding. Developed first head-mounted (augmented
  reality) display. Made famous computer graphics lab and University of Utah.
  * Many of the people below were in Sutherland's lab!
* Henri Gouraud (1960s): Invented method of shading (Gouraud Shading) to make
  polygonal models appear smoother.
* Ed Catmull (1900s): Invented z-buffering, texture mapping (to polygons), and
  new kind of surface.
* Bui Tong Phong: Improved upon Gouraud shading by tweaking the algorithm to
  run on every pixel (now called Phong Shading). This was not feasible for
  high-performance use cases until recently.
* Jim Blinn: Improved Phong shading (now called Blinn-Phong shading). Developed
  bump mapping and environment mapping.
* Turner Whitted: NCSU student! Invented/improved ray tracing/casting,
  including handling of shadows, reflection, and refraction.
* Jim Clarke (1980s): Developed methods of describing surface patches. Founded
  silicon graphics (hardware graphics company) and co-founded Netscape.

The Utah teapot is a teapot that was modeled by Martin Newell. It was the first
realistic, somewhat complex model to see widespread use for testing objects.
It's good because it casts shadows on itself, is immediately recognizable, and
it doesn't need to be textured to look good. However, it's also not so complex
as to be difficult to render or massive in size. It also got squished at some
point!

# Ray Casting/Tracing

## History

Arthur Apple invented ray casting in 1968, that is following the light
backwards by moving rays from the camera to other places.

A **camera obscura**, also known as a pinhole camera, is camera formed by
allowing light to enter through a small pinhole in the surface. This requires
there to be a large difference in brightness from the inside of the camera to
the outside. Pinhole cameras are theorized to have first come up from pinhole
cameras being naturally formed by tree foliage.

## Terms

Here are some terms for camera movement:
* Dolly: Move forward/backward
* Pedestal: Move up/down.
* Truck: Move left/right.
* Pitch: Look up/down.
* Pan: Look left/right.
* Roll: Rotate left/right.

**Ray casting** is a way of creating images from a specific perspective in a
scene.

Any camera has the following properties:
* Position: Point in 3D space where the camera sits.
* Look-at Vector: Vector which points in the direction where the camera is
  looking. This defines pitch and pan.
* Look-up Vector: Vector which points directly up relative to the camera. This
  defines roll.
* Field of View (FOV): Number of degrees by which the sight vectors can deviate
  from the look-at vector. There can be a vertical and a horizontal FOV which
  changes the aspect ratio and corresponding camera's frustum.
* Aspect Ratio (W:H): Ratio of the width of the viewable area to the height.

The camera's goal is determine what each pixel should be on the **viewport**.
The viewport is a fictional surface some short distance away from the camera
that fits within the frustum. This viewport has pixels and to fill in those
pixels we cast rays from the camera to the pixel. Using those rays we fill in
the color of the pixel.

We often have a **near-clip plane** which is some distance away from the camera
before we starting casting rays and a **far-clip plane** which is where we stop
casting rays (almost like they've hit fog). Inside these two planes we have a
**frustum** which is like a 3D trapezoid.

Simple ray casters only don't deal with illumination because they only cast a
single **ray** and don't consider how it may bounce off the surface. That is,
they hit the surface and register that point.

For that you'd have to do **ray tracing**. Ray tracing logically continues the
ray by allowing it to bounce off surfaces and only stop if it either goes too
far or hits a light source. It further considers how the surfaces would impact
the color or quality of the light. That is if you hit a white surface and then
bounce off and hit a green light, the pixel will appear slightly green. This
enables high quality shadows, reflection, and refraction.

A **Cornell box** is a standard test scene for computer graphics. You have a
block with two different color walls on the left and right, a white background
wall and ceiling, a ceiling with a hole in it to let light thru, and a colored
object filling up most of the scene. This is particularly useful to test
**color bleeding**, where colors reflect onto nearby objects and seem to
"bleed" onto them.

## Math

When doing ray casting, you need to know what objects you're dealing with so
you can do the correct math.

Often when doing computer graphics, we want to do **bilinear interpolation**
(bi-lerp). That is, suppose you have a rectangle with some important properties
at each corner (UL, UR, LL, LR). Bilinear interpolation gives you a way to
calculate/interpolate the value of those properties at any point within the
rectangle.

```py
def bilerp(x, y):
    # This assumes x and y are normalized from 0 to 1
    above = x*UL + (1-x)*UR
    below = x*LL + (1-x)*LR
    return y*above + (1-y)*LR
```

### Finding Ray

To find the ray for a specific pixel, we need the location of the eye $E$ and
the projection window coordinates $UL$, $UR$, $LL$, and $LR$. (These stand for
upper-left, upper-right, lower-left, and lower-right respectively.)

To find the coordinates of the pixel $P$, you do bilinear interpolation of the
coordinates of $UL$, $UR$, $LL$, and $LR$ using the pixel's $x$ and $y$ within
screen space.

To define the ray's position at any time $t$, you use the position of the eye
$E$ and that of the pixel $P$, giving you
$$R(t) = E + t(P-E) = E + tD$$
where $D$ is the direction vector of the ray.

### Ellipsoid Collisions

Let $S$ be a point. We say the point is on the surface of the ellipse if the
following is true:
$$\left\|\frac{S-C}{A}\right\|^2 = 1.$$
That is, $S$ is the surface of the ellipse.

Now if you plug-in the equation of the ray into the ellipse equation and solve
for $t$. That is you use this equation
$$\left\|\frac{R(t)-C}{A}\right\|^2 = 1$$
and solve for $t$ you get the following
$$at^2 + bt + c = 0$$
where
$$a = \left\|\frac{D}{A}\right\|^2,$$
$$b = 2\left(\frac{D}{A} \cdot \frac{E-C}{A} \right),$$
$$c = \left\|\frac{E-C}{A}\right\|^2 - 1.$$

Since this is just a quadratic, we can use the quadratic formula!
$$t = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

If we get one value of $t$, then we have just "grazed" the ellipse. If we have
two values of $t$, then we've intersected it fully. If we have no values of
$t$, then we've missed it entirely. You can just check the discriminant
($b^2-4ac$). If it's positive, you've intersected (two solutions). If it's
zero, you've grazed (one solution). If it's negative, you've missed (no
solutions).

Now once you've found solution(s) for $t$, you pick the smaller $t$ and plug it
in to the ray equation $$R(t) = E + tD$$ to find the intersection point.

### Triangle Collisions

A triangle is defined by three points $A$, $B$, and $C$. Our goal is to
determine if the intersection point $I$ exits and find it if it does.

To do this, we need to find the **normal (vector) of triangle $ABC$** $N$ by
doing
$$N = \vec{BA} \times \vec{CA}$$
where $\vec{BA}$ and $\vec{CA}$ are vectors from B to A and C to A.

This vector $N$ gives us a definition of the plane of triangle $ABC$:
$$N_xx + N_yy + N_zz = d.$$

This gives us a test function for whether a point is on the surface of the
triangle. That is, for all points $S$, we know
$$N \cdot S = d.$$

However, there's an issue! We don't know what $d$ is. To find $d$, we take a
known point on the triangle (one of the vertexes) and solve for $d$. Let's use
the first vertex $A$. We find which we can write in vector form as
$$d = N \cdot A.$$

Now again like we did with ellipsoids, if you plug in the ray at time $t$
$R(t)$ as $S$ into the previous equation and solve for $t$, you find the time
at which the ray intersects the triangle.
$$N \cdot R(t) = d.$$

Solving for $T$ gives us the following equation
$$t = \frac{d - N \cdot E}{N \cdot D}.$$
Notice that if $N \cdot D = 0$, then the ray and the plane are parallel and
there is no intersection. (Even if there are infinite intersections, we don't
render them because that complicates the equation and we treat the triangle as
infinitely thin.)

Now, to find $I$ we plug in the solved for $t$ (if it exists) into $R(t)$.

Now that we have $I$, we need to determine if $I$ is inside or outside the
triangle. An easy way to do this is you know the point is on the inside of the
triangle if and only if the point is on the same side of each edge. The way you
know which side is by doing the following
$$\text{sign}(N \cdot (I - V_i \times V_{i+1} - V_i)).$$

### Picking the Right Collisions

Now once you have all your collisions with all objects, you need to pick the
first intersection you care about. You do this by picking the one with the
smallest $t$ which is greater than 1. We pick 1 because $t=1$ is when the ray
intersects the view plane.

## Local Illumination

Local illumination is a method for determining the color a given ray should
result in. We'll be discussing Phong shading and then Blinn-Phong shading.

Bui Tong Phong's illumination algorithm cares about 5 vectors when a ray hits
the surface:
* $V$ (view): Vector from point to eye.
* $L$ (light): Vector from point to light.
* $N$ (normal): Vector normal to surface.
* $R$ (reflection): $L$ reflected across the normal $N$.
  * We find $R$ by finding the components of $L$ which are parallel $L_p$ and
    non-parallel $L_n$ to $N$. We then define $R = L_p - L_n$.
* $H$ (half): Vector halfway between $V$ and $L$ (just take the average).

Note that we expect all these vectors to be unit vectors (i.e. normalized).

There are three terms of Phong's model:
* Ambient $C_\text{ambient}$ (color): Shadows. Approximates indirect light.
  Light that lights up everything including shadows.
* Diffuse $C_\text{diffuse}$ (directional): Matte lighting. Follows Lambert's
  Law. Simulates how brightness of light on a surface depends on angle between
  the surface and light source. This emulate how light "grazing" the surface
  doesn't light it up much (low density of photons) but light directly hitting
  a surface is brighter (high density of photons)
* Specular $C_\text{specular}$ (highlights): Bright spot. Depends on angle
  between eye and light source. This emulates mirror-like reflections.

You add all these terms together to get the color:
$$C = C_\text{ambient} + C_\text{diffuse} + C_\text{specular}.$$

To find the **ambient** lighting $C_\text{ambient}$, you need 2 (arbitrary)
variables $K_a$ and $L_a$. $K_a$ is the percentage of light that you see comes
from ambient light (normally 5-10%). $L_a$ is the color of the light source.
This gives us the equation
$$C_\text{ambient} = K_aL_a.$$

Note that this simulation of a single ambient light source is crude because the
ambient light comes from somewhere so it's color will be affected.

To find the **diffuse** lighting $C_\text{diffuse}$, you need the vectors $N$
and $L$ and 2 arbitrary variables $K_d$ and $L_d$. Again $K_d$ is the
percentage of light you see which comes from diffuse light and $L_a$ is the
color of the diffuse light. This gives us the equation
$$C_\text{diffuse} = K_dL_d \max(N \cdot L, 0).$$

To find the **specular** lighting $C_\text{specular}$, you need the vectors $V$
and $R$ along with an arbitrary integer $n$. As $n$ get larger, the spot gets
smaller as the light gets more focused. We know the light is a function of the
angle between $V$ and $R$, $V \cdot R$, which has a bell-curve / bump shape.
Phong ended up using this function $(V \cdot R)^n$. This function is arbitrary
but works pretty well. We again have $K_s$ as the percentage of light which
comes from specular light and $L_s$ which is the color of that light. This
gives us the equation
$$C_\text{specular} = K_sL_s (N \cdot L)^n.$$

Combining all these lights we get
$$C = C_\text{ambient} + C_\text{diffuse} + C_\text{specular}$$
$$= K_aL_a + K_dL_d \max(N \cdot L, 0) + K_sL_s (N \cdot L)^n.$$

James Blinn improved the **specular lighting** part of the **Phong shading**
model, making it the **Blinn-Phong shading** model. He observed that specular
lighting really occurs more when $N$ and $H$ are close together. That is
because real life surfaces are rough and have tons of little micro-bumps/facets
and $H$ describes where they point on average with what we can see. Therefore,
when $N$ and $H$ are close the micro-bumps/facets will almost perfectly reflect
the specular light to our eyes. That is instead of the light being a function
of the angle between $V$ and $R$, it is the angle between $N$ and $h$, that is
$N \cdot H$. This gives us a new equation for the specular color as
$$C_\text{specular} = K_sL_s (N \cdot H)^n.$$

Now in Blinn-Phong shading we get
$$C = C_\text{ambient} + C_\text{diffuse} + C_\text{specular}$$
$$= K_aL_a + K_dL_d \max(N \cdot L, 0) + K_sL_s (N \cdot H)^n.$$

## Ray Tracing

We will incrementally build ray tracing up from ray casting.

The first step is to consider **shadows**. To determine if a point is in
shadow, whenever you find a collision cast a ray from it to the light
source(s). If that ray collides with anything, then don't include the diffuse
or specular light from the Blinn-Phong model.

***Note:*** The following math might not be right.

Now for **reflections**, you have to find the reflection ray
$R_\text{reflection}$. We find $R$ by finding the components of $V$ (the vector
from collision to the eye) which are parallel $V_p$ and non-parallel $-V_n$ to
$N$ and then define $R_\text{reflection} = V_p - V_n$. This simplifies to the
following where $R$, $N$, and $V$ are normalized to unit vectors.
$$R_\text{reflection} = 2(N \cdot V)N - V$$

Now, to handle the reflections we have a new coefficient $K_\text{reflection}$
and find $C_\text{reflection}$ by recursively finding the color of the
reflected ray. We keep track of how many bounces we've done for each level of
recursion and stop after some set number of maximum reflections
$M_\text{reflection}$.

We handle **refraction** similarly to reflections except we do different math
to find the refraction ray $R_\text{refraction}$. The math here comes from
**Snell's Law**, which we won't cover in this class. This again introducing
another color and coefficient $K_\text{refraction}$ and $C_\text{refraction}$
like with reflection (and all other colors). We similarly keep track of each
level of recursion and stop after some set number of maximum refractions
$M_\text{refraction}$.

One issue with ray tracing is it only considers **specular reflections**. That
is when you have a crisp clear reflection. It doesn't consider diffuse
reflections, that is "color bleeding" style reflections.

Also, ray tracing is computationally intensive. One way to improve performance
is the split the world into cubes recursively. Before we check for collisions
of objects in the box, we determine if the ray collides with the box at all. We
have the boxes recursively so we can hone in on the collided box(es) similar to
how binary search works.

# Rasterization

Rasterization is an alternative method of rendering objects to ray casting. It
is (especially was) the most common method of rendering 3D objects because of
how cheap and hardware friendly it is. Sadly, rasterization is more complicated
to understand and harder to add shadows, reflections, and refractions.

One important difference of rasterization is that you will be doing full
shading on every single object in the model because, when we're doing shading,
we don't know yet which object is closest. This gets worse the more
triangles/objects you have stacked up. That is the **depth complexity** of the
scene.

*So why is rasterization faster?* It's (relatively) easy to cut out unnecessary
pixels for each object's pass which can save ***huge*** amounts of work because
most objects only show up in a tiny number of pixels.

We can also do **deferred shading**, where our first pass is just to solve
occlusion (i.e. figure out which objects are in front), saving a bunch of
information, and then we do shading with this information.

*Given a pixel in a triangle, how do you interpolate the values at the
coordinates?* You first find out how far along you are along two of the edges.
Once you have that, you can do bilerp as normal. Find the value on the edge of
your point to your left and right. Then you find where you are between your
left and right points and do the weighted sum again.

The naive way to do this, using world coordinates, is called **affine bilinear
interpolation** and results in morphing and skewed textures. We can resolve
this using **perspective interpolation**

For perspective interpolation, you need to
1. Perform perspective divide to go to 3d: $[s/w \quad t/w]$.
1. Append the denominator: $[s/w \quad t/w \quad 1/w]$.
1. Perform bilerp to point $p$ including the denominator: $[s/w_p \quad t/w_p
   \quad 1/w_p]$.
1. Undo the divide: $[s_p \quad t_p]$.

*Note:* OpenGL/WebGL automatically does this for us.

## Rasterization in OpenGL/WebGL

Instead of logically looping over pixels and then objects (**image-order**),
you iterate over all objects and then pixels (**object-order**). However, most
graphics APIs (e.g. OpenGL) handle this iteration for you.

A **vertex shader** takes all the objects in your scene (whose vertexes are 3D
points) and outputs coordinates those vertexes should appear on the screen. In
OpenGL, this is programmable and must produce output into `gl_Position`.

With these now projected vertexes and an index array describing the triangles,
the **rasterizer** chops the triangles into pieces called **fragments**. These
fragments are the pixels which intersect with the triangle. In OpenGL, this is
not programmable.

Now, the **fragment shader** must color the fragments produced by the
*rasterizer*. In OpenGL, this is programmable and must produce output into
`gl_FragColor`.

Now, the **compositor** combines these fragments. In OpenGL, this is not
programmable but is configurable. For example, the compositor may do *hidden
surface removal* by ignore/removing pixels behind the frontmost one. There may
also be *transparency* where you instead take averages.

# OpenGL/WebGL

Khronos is the group which maintains OpenGL and WebGL. WebGL is an web-based
implementation of OpenGL.

OpenGL was born as Iris GL, which was a proprietary API owned by Silicon
Graphics. In the 90s however, they decided to make it an open specification.

WebGL 1.0 was a descendant of OpenGL ES 2.0. WebGL 2.0 was released in 2018 and
is a descendant of OpenGL ES 3.0.

For OpenGL, you need to know **GLSL** (Graphics Language Shader Language). GLSL
code is compiled and executed by the GPU.

**Vulkan**, aka OpenGL Next 5.0, is a lower-level rework of a lot of OpenGL for
the purpose of being more cross-platform and having better performance.

**Metal** is a MacOS based API similar to Vulkan. It was developed before
Vulkan. **Mantle** is that for AMD. **Direct3D** is that for Windows.

## Usage

The process for rendering in WebGL is
* Set up WebGl.
* Load model.
* Process model.
* Render result.

See these rendering primitives in WeblGL:
<https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants#rendering_primitives>

The **vertex shader** (programmed in GLSL) takes in **attributes**, per-vertex
info like position and color; and **uniforms**, such as ambient light and
perspective. It produces **varyings**, per-vertex values to be interpreted by
fragment shader; `gl_Position`, the position of the vertex in clipping space;
and `gl_PointSize`, the size of the point sprite.

The **fragment shader** takes in the varyings from the vertex shader and the
same uniforms the vertex shader got. Then it outputs `gl_FragColor`, the color
of the fragment which is used when only one render target is used; and
`gl_FragData[]`, fragment colors when multiple render targets are used.

*How do we debug shaders?* Keep them simple and correct, visualize debug
values, possibly implement them in JavaScript. There's also some tools in the
console. There's also an extension called WebGL insight.

OpenGL 2.0 removed matrix math. There's a useful library called
[`glMatrix`](https://glmatrix.net/) which re-implements the removed matrix
code.

Here's a cheatsheet for WebGL 2.0:
<https://www.khronos.org/files/webgl20-reference-guide.pdf>

# 3D Models

In this class, we prefer convex polygons because it makes it more simple to
determine if we are inside the polygon or not.

We additional prefer to deal with triangles because they always define a plane.
You can convert every polygon to triangles (i.e. triangulate the polygon)
however.

If we have a complex surface, to convert it to a polygon we sample the surface
at several points (at regular intervals) to define vertexes of the surface. We
then connect the appropriate vertexes with edges to create the triangles.

After this, we have a minimally described 3D model. We often go further and add
*attributes* to the model to describe its material(s) and how they reflect
light.

We can also define vertex normals, which are normals pointing out from
vertexes. These are included in attributes and are often used to shade the
surface in a way to hide its facets / polygons.

# Transforms

We describe transforms of coordinates using matrixes. You can intuitively see
how this works for rotation and scaling but it's not immediately clear how this
works for translations.

The trick to make it work for translation is that we add an additional element
to every vector, so we deal with vectors in $\mathbb{R}^4$ then our matrixes
exist in $\mathbb{R}^{4 \times 4}$ accordingly. These are called **homogeneous
coordinates**.

A transformation matrix on homogeneous coordinates ($\mathbb{R}^{4 \times 4}$)
can intuitively be seen by a transformation matrix $T$ with an offset vector
$o$.

$$
\begin{bmatrix}
    &   &   & \vdots \\\\
    & T &   & o \\\\
    &   &   & \vdots \\\\
  0 & 0 & 0 & 1 \\\\
\end{bmatrix}
$$

## Translation, Scaling, & Rotation

Let $h$ be a homogeneous coordinate and define $p$ to be the ordinary
coordinate. This is specific to 3D ordinary coordinates, but a similar idea
works in general.
$$
h = \begin{bmatrix}
  x \\\\ y \\\\ z \\\\ w
\end{bmatrix}
\iff
p = \begin{bmatrix}
  \frac{x}{w} \\\\ \frac{y}{w} \\\\ \frac{z}{w}
\end{bmatrix}
$$

Here's an example of a **translation**

$$
\begin{bmatrix}
  1 & 0 & 0 & X \\\\
  0 & 1 & 0 & Y \\\\
  0 & 0 & 1 & Z \\\\
  0 & 0 & 0 & 1 \\\\
\end{bmatrix}
\begin{bmatrix}
  x \\\\ y \\\\ z \\\\ 1
\end{bmatrix}
= \begin{bmatrix}
  x + X \cdot 1 \\\\ y + Y \cdot 1 \\\\ z + Z \cdot 1 \\\\ 1
\end{bmatrix}
$$

Here's an example of a (one-dimensional) **scaling**
$$
\begin{bmatrix}
  S_x & 0   & 0   & 0 \\\\
  0   & S_y & 0   & 0 \\\\
  0   & 0   & S_z & 0 \\\\
  0   & 0   & 0   & 1 \\\\
\end{bmatrix}
\begin{bmatrix}
  x \\\\ y \\\\ z \\\\ 1
\end{bmatrix}
= \begin{bmatrix}
  x \cdot S_x \\\\ y \cdot S_y \\\\ z \cdot S_z \\\\ 1
\end{bmatrix}
$$

Here's an example of a **rotation** (around the $x$-axis)
$$
\begin{bmatrix}
  1 & 0 & 0 & 0 \\\\
  0 & \cos \theta & -\sin \theta & 0 \\\\
  0 & \sin \theta & \cos \theta & 0 \\\\
  0 & 0 & 0 & 1 \\\\
\end{bmatrix}
\begin{bmatrix}
  x \\\\ y \\\\ z \\\\ 1
\end{bmatrix}
= \begin{bmatrix}
  x \\\\ \cos\theta \cdot y - \sin\theta \cdot z \\\\ \sin\theta \cdot y + \cos\theta \cdot z \\\\ 1
\end{bmatrix}
$$

To compose transformations, we multiply their matrixes together. The rightmost
one is applied first. The leftmost one is applied last.

All transformations are done relative to the origin. While this doesn't matter
for translation, it does matter for rotation and scaling. To account for this,
apply a translation to move one vertex to the origin, do your operation, and
then apply the inverse translation to move that vertex back.

Composite rotations are confusing because earlier rotations changes the axis of
rotation for future rotation. We can *sidestep* this issue by defining a
rotation fully. That is, instead of composite rotations we define change of
basis from one orthonormal basis to another. Intuitively, this is like applying
a (complex) rotation to all 3 axes in unison.

To define a rotation around an axis, we change the basis of the current system
so that the new $y$-axis is aligned with the rotation, then we apply a regular
rotation about the $y$-axis, and finally apply the inverse change of basis,
returning us to the original coordinate system.

*Note:* You can actually interpret all transformations as either changing the
coordinate system or moving the object. It doesn't matter.

## Types of Transforms

* Rigid Body: Translation or rotation. Preserves angles and lengths.
* Affine: Rigid body or scale. Preserves parallelism.
* Perspective: Does not preserve parallelism.

## Transforms & Normal Vectors

Just applying the transformations you make to a model's vectors to its normal
vectors doesn't necessarily make sense. This works for uniform transformations,
that is transformations which don't change the shape of the model. However, if
you have something like a skew which modifies the shape of the object, then the
normal vectors will be affected in weird ways.

Consider a rectangle which is made into a parallelogram by pushing the top to
the right, that is the left and right side are skewed but the top and bottom
remain parallel. If we were to apply this transformation to the normal vectors
naively, then the normal vector of the top would become slanted but the normal
vector of the right would remain unaffected. However, this is exactly what we
*don't* want.

Suppose we have some model $M$ with normals $N$ and we want to apply
transformation $T$ to the model to get model $M'$ and normals $N'$. The math to
do this is
$$M' = TM \quad$$
$$N' = (T^T)^{-1}N \quad.$$

This $(T^T)^{-1}$ is how we handle the issue of normals changing in unintuitive
ways.

# Projections

Using the standard viewing coordinates of an eye at the origin looking towards
positive $z$, the projection of a point $p = [x, y, z]$ is

$$p = \begin{bmatrix} x \\\\ y \\\\ z \end{bmatrix}$$
$$p_\text{homogeneous} = \begin{bmatrix} x \\\\ y \\\\ z \\\\ 1 \end{bmatrix}$$
$$
T_\text{proj} = \begin{bmatrix}
  1 & 0 & 0 & 0 \\\\
  0 & 1 & 0 & 0 \\\\
  0 & 0 & 1 & 0 \\\\
  0 & 0 & 1 & 0 \\\\
\end{bmatrix}
$$
$$
\text{proj}(p_\text{homogeneous})
= T_\text{proj}p_\text{homogeneous}
= \begin{bmatrix} x \\\\ y \\\\ z \\\\ z \end{bmatrix}
$$
$$\text{proj}(p) = \begin{bmatrix} x/z \\\\ y/z \\\\ 1 \end{bmatrix}$$

Notice that we are dividing by $z$ in $\text{proj}(p)$. This is the essence of
projection. Farther away objects become smaller.

The way we do projection is we take our arbitrary viewing setup / eye,
described by a set of 3 (orthogonal basis) $x$, $y$, and $z$ vectors and a
position/offset $o$. This gives us a viewing transform $V$, which transforms
our viewing setup to the origin and converts the basis vectors into the
standard normal basis.

$$
V = \begin{bmatrix}
  \vdots & \vdots & \vdots & \vdots \\\\
  x      & y      & z      & o      \\\\
  \vdots & \vdots & \vdots & \vdots \\\\
  0 & 0 & 0 & 1 \\\\
\end{bmatrix}
$$

In WebGL this is `mat4.lookAt(...)`.

Then we have our standard projection matrix $P$.

$$
P = \begin{bmatrix}
  1 & 0 & 0 & 0 \\\\
  0 & 1 & 0 & 0 \\\\
  0 & 0 & 1 & 0 \\\\
  0 & 0 & 1 & 0 \\\\
\end{bmatrix}
$$

In WebGL this is `mat4.perspective(...)` or `mat4.frustrum(...)`.

Thus we get our complete projection transformation $T$ that takes our viewing
setup and converts any world coordinates into projection coordinates $T = PV$.

We're almost done but not quite. Our window is currently from -1 to 1 in both
$x $and $y$. To fix this, we have to apply the following transformation

$$
\begin{bmatrix}
  w/2 & 0 & o_x \\\\
  1 & h/2 & o_y \\\\
  0 & 0 & 1 \\\\
\end{bmatrix}
$$

In WebGL this is `gl.viewport(...)`.

*Note:* Every model is defined with its own arbitrary origin. So to not have
all of these models overlap, we have to first transform the model coordinates
to world coordinates using that model's specific offset. These are done in
WebGL using the using the standard `mat4.{translate,scale,rotate}(...)`.

This gives us a final pipeline of:

1. Model Coordinates
  * Modeling Transform
1. World Coordinates
  * Viewing Transform
1. Viewing Coordinates
  * Projection Transform
1. Normalized Device Coordinates
  * Viewport Transform
1. Device Coordinates

## Parallel vs Perspective Projections

For certain aesthetic or functional reasons, you might need to choose between
**parallel** and **perspective** projections.

In parallel/orthographic projections, the eye is a plane and all view vectors
are parallel. In perpsective projections, the eye is a point and no view
vectors are parallel.

Perspective projection approaches perspective projection as you get farther and
farther away.

# Hardware & The Graphics Pipeline

In OpenGL 3, there were two programmable shaders: the **vertex shader** and
**fragment shader**. They are run in that order.

In OpenGL 3, they added a **geometry shader** between the vertex and fragment
shader. And they were run in that order. The geometry shader is often unused
because it forced a specific ordering on your fragments which slows down
performance. Although WebGL is based off of OpenGL 3, it does not have the
geometry shader.

In OpenGL 4, a **tessellation shader** was added. It takes high level surface
specifications (e.g. spline patches) and then convert them to triangles. This
is used to reduce the number of data passed in.

One reason that GPUs are fast is because of **pipeline parallelism**. That is
they split the many steps needed to do rendering into steps and then do those
steps on different things at the same time, instead of waiting for one shape to
make it through the entire pipeline before starting the new one.

One disadvantage of pipelining is that it is almost impossible to balance
loads, there is significant bandwidth use from transferring data from piece to
piece, and likewise there is significant start-up and shut-down costs. It also
cannot do *cull optimization*, where we skip certain steps if we discover
they're unnecessary.

There is another optimization called **SIMD parallelism**. It applies a Single
operation/Instruction to Multiple pieces of Data without moving the data. It is
good because you don't have to transfer data from place to place like in a
pipeline. You also don't have to balance loads because there is only a single
place doing the work. However, it fails if you have one piece of data that has
to do different operation (e.g. one vertex has to be clipped but not all). It
also struggles to broadcast data to every piece of data it's acting on.

**NIMD parallelism** is what happens when you use both.

There is another part of GPUs called the **compute shader**. They allow the GPU
to be used for general purpose computing, that is things that are not
specifically graphics, for example machine learning.

# Shading

Shading is the process of determining the color of a piece of a polygon, called
a fragment (triangle).

For shockingly long, we had no hardware support for dealing with fragments and
their shading. There was only vertex transformations, and eventually some
support for vertex lighting.

There are many different shading methods.

The simplest shading method is called **flat** (i.e. per-triangle) shading.
Each triangle has its own normal and that normal is used for every fragment's
pixel in the fragment shader. This results in sharp facets/edges between
triangles, which we don't want in general.

There's another method called **Gouraud** (i.e. per-vertex) shading. The idea
is you calculate the shading at each vertex using the vertex normals and then
interpolate colors. This results in smoother colors but with the facets/edges
still somewhat visible.

*How do we get the vertex normal?* If we're tessellating a patch we might be
lucky enough to be able to directly calculate the normals. Otherwise, we can
take the average of all the surrounding face normals.

Yet another method is called **Phong** (i.e. per-fragment) shading. The idea is
you use the normal vectors at the vertex and interpolate the 3 vertex normals
of the triangle your in, at your position. This results in *much* smoother
shading with no obvious facets/edges, much better than even Gouraud shading.
This was the first shading technique where specular highlights really looked
good. Note that you must always re-normalize your interpolated normal vector in
order to ensure it is always a unit vector, otherwise they might end up too
short and result in weird/dim lighting because of that.

*Note:* Unlike Gouraud shading, Phong shading wasn't possible to do
interactively until decades after his death once hardware caught up. This
should make sense because with Gouraud shading, you're calculating very few
colors and just doing basic interpolation to get the colors of every fragment.
However, with Phong you're not only performing all the normal calculations but
also interpolating vectors and normalizing them.

*Note:* In practice, you only want either Phong shading, because it's so
smooth, or flat shading, for the aesthetic. Gouraud shading is just a less
smooth smooth shading algorithm than Phong shading.

## Smooth Objects vs Non-smooth Objects

Sometimes, the smooth shading models of Gouraud and Phong shading look
terrible, for example with sharply angled shapes or shapes that are not
supposed to be smooth. Since these models try to smooth out edges, they can
look wrong or with sharply angled shapes, very weird. For example, with a cube
those shading models will shade the cube almost as if it were a super low-poly
sphere.

# Texturing / Texture Mapping

Texture mapping is the process of adding colors to models. In its simplest
form, you are just wrapping some 2D image around a surface.

This process can be extended with alpha which allows parts of the model to be
partially or fully transparent. Likewise it can be extended with bump mapping,
which allows texture mapping affect lighting calculations. There are also the
techniques of shadow mapping and relief mapping.

What makes texture mapping possible is having a mathematically well-defined
coordinate system for the surface of a model.

For clarity, we call the pixels in the texture **texels** and use $u$-$v$
coordinates rather than $x$-$y$ coordinates. Then, each vertex on a model gets
a set of $u$-$v$ coordinates describing what part of the texture should be
mapped to it. Then, in the fragment shader, you get the interpolated $u$-$v$
coordinate of your triangle's vertexes.

## Getting $u$-$v$ Coordinates

*Where do we get these $u$-$v$ coordinates?* If you're using spline patches,
you get those "for free" by just defining the $u$-$v$ coordinates for the
corners of your patch.

If you aren't doing that, we can do a 2-stage approach. First, you map the
texture to a simple shape logically containing that object in its center. Then,
you map that simple shapes texture onto the object. You want the simple shape
to as closely match the object's shape as possible.

If your object or texture is more complicated such that a 2-stage approach
won't work, you have to manually build up the texture mapping. There are tools
and techniques to make this easier. For example, you can break the object's
surface into chunks and texture the chunks. These chunks' textures may then be
stored separately or packed into a single image.

## Applying Textures

*Given a $u$-$v$ coordinate, how do we look up the color?* This seems simple
but is surprisingly difficult because your coordinates are unlikely to line up
perfectly with a texel. Additionally, in screen space we are looking at simple
pixels (i.e. squares), but due to perspective projection these might actually
be notably skewed in texture space.

There's broadly two ways this can arise: **magnification** and
**minification**. Magnification is when the pixel is smaller than the texel and
you have to expand the texture. Minification is when the pixel spans multiple
texels.

### Magnification: Nearest Neighbor vs Linear Interpolation

The two common ways to handle magnification, that is when your pixel falls
within a texel, is either using nearest neighbor or linear interpolation. For
nearest neighbor, you just pick the closest texel and use it exactly. This
tends to be very fast but often looks bad with sharp lines and aliasing. Linear
interpolation means you interpolate the color of the pixel from the neighboring
texels. This is slower but often yields smoother, more attractive textures.
*Note:* For certain styles, like pixel-art or pixelated styles, you want to use
nearest neighbor to get sharp colors.

In OpenGL, you can pick between these two methods with `glTexParameteri(...)`
by choosing either `GL_NEAREST` or `GL_LINEAR`.

*Note:* Generally, magnification is somewhat unsolved. That is we can't zoom in
infinitely. We're limited by the quality of our imagery / textures.

### Minification: Mipmapping

*Note:* It feels like minification might only happen at a distance where the
objects themselves seem very small so of course the pixels cover many texels.
However, it's important to realize that minification also occurs when looking
at things side-long / almost tangent to the surface because then again

For minification, we have the opposite issue where we have several texels
within a single pixel. This has the issue of sharp edges tend to either get
lost or even worse become spotty, as only some of the pixels pick the edge
texel or none of them pick it strongly. This can be fixed with **mipmapping**.
MIP is short for multum in parvo (i.e. many in a small place).

Logically, mipmapping is the process of averaging the values of all the texels
within the pixel. However, this is difficult to do in real time, so instead
mipmapping has pre-computed scaled down versions of the texture (normally two
times scaling at each level). Each of these scales has a $d$ value which
describes how much of the texture a single texel takes up. So it is $1/64^2$
for a 64 by 64 texture.

Then, at runtime you determine your pixels size in texture space $d$ as a
proportion of the texture, pick the appropriate texture scale, and then use
that texture as normal. (You don't need to exactly know your pixel size, just
an approximation.)

*How do you pick the appropriate texture scale?* You want to match the size of
your texels to that of your pixels. So if your pixel takes up $1/32^2$ of the
pixel, you want to use the 32 by 32 version of the texture.

Of course you almost never line up exactly with a given scale, so you have to
do something to figure that out. For **trilinear** mipmapping, you need to look
at the two values of $d$ you're straddling. Then, you find the color of your
pixel in those two levels and do linear interpolation of those colors using
your value of $d$ and the two levels values of $d$. This results in a much
smoother image with severe aliasing. It does result in things fading at a
distance.

You can still have smoother images with less aliasing without things fading by
using **anisotropic** filtering. This means you don't average over as much of
the texture which leads to images still being sharp far away. Basically, this
is just a better approximation of the size of the pixel in texture space.

## Wrapping

*What happens if our texture coordinates exit the 0 to 1 range?* There are
three main ways: repeating, mirroring, and clamping. These should hopefully be
intuitive by name. For repeating, you do mod and cycle the texture. For
mirroring you start going down in coordinates. For clamping you just take
either 0 or 1 if you're outside of the range.

Normally you won't really want to use clamping if you're expecting the texture
coordinates to go far beyond the range. However, repeating and mirroring often
times look very repetitive or plain.

## Lighting & Multi-texturing

Normally we'll want to either **modulate** or **replace** the color. For
modulate, we use the Blinn-Phong illumination using the color of the texture as
the material. Or alternatively, multiply the color from the texture by the
color of the fragment after illumination. For replace, we simply set the color
to be that of the texture.

*Note:* We ***multiply*** the color rather than averaging. This results in a
much more intuitive and attractive combination.

You can also overlay textures (often pre-computed light textures) to improve
the quality. You do the same strategy here as you would for modulating the
color using the Blinn-Phong lighting model, just the lighting gotten from a
pre-computed texture. This is called **light mapping**.

# Hidden Surface Removal

With rasterization, you don't get occlusion for free. That is, by default with
rasterization you render and display all objects no matter if something is
blocking them or not and the "winning" object (i.e. the one actually displayed)
is just the one rendered last. Hidden surface removal is the process of hiding
or not displaying the parts of the image you cannot see.

## Back-face Culling

One way to do partial hidden surface removal is **back-face culling**. For
this, you simply don't render triangles which are occluded. This has the
benefit on cutting down on the number of objects rendered.

*How do we determine if a triangle is back-facing, that is should be culled?*
The simplest way is to take the dot product of the view vector (from collision
to eye) and the normal vector of the collision. If it's negative, then the
triangle is back-facing.

*How do we know the normal vector of the triangle?* The model could tell us.
Alternatively, we could choose a convention so that we can tell the facing by
the order of the triangle's vertexes. Typically, we say a triangle is facing
you if the vertexes are winding counterclockwise and is facing away from you if
they're clockwise.

Back-face culling is not a full solution to hidden surface however. For one,
this does assume that we never want to see the back faces of a model. This is
true for closed models but not for open ones. Additionally, this does not work
if we have have *occluded front-faces*. For example consider looking at a
torus/donut from the side, both the inside and outside of the donut are facing
us but we only want to see the outside.

## Painters Algorithm

The painters algorithm renders objects in order of depth, from farthest to
closet by sorting all the triangles by view depth (i.e. distance from eye)
first before rendering. This naturally means that the farthest objects will be
overwritten/occluded by the closest objects as desired.

This has a problem for intersecting polygons or polygons where neither one is
clearly in front of the others, for example with cyclic relationships, like
with the lid on a cardboard box. Also, sorting every single frame is somewhat
slow.

Then if you try to sort by pixel it's even harder.

## Z-buffering

The most common technique to do this is called **z-buffering**. This is mostly
implemented in hardware at this point, which is why it's so fast and common.

Logically, every single fragment has a $z$ value and those with the closest $z$
value (past the near clipping plane) are picked as the winning fragment to be
rendered.

Implementation wise, you add a **depth buffer** or **z-buffer**, alongside the
frame buffer, which is initialized with max $z$. Then, for every fragment you
take their $z$ value $z_\text{frag}$ and compare it to the current value in the
z-buffer. If it is lower/closer (and past the near clipping plane), you put
that fragment's color to the frame buffer and update the z buffer with your
$z_\text{frag}$

**Pros:** Z-buffering is really fast (linear) and you can render triangles in
any order.

**Cons:** You have issues if the depth is identical where the winning object
will be chosen arbitrarily, called **z-fighting** (a modelling issue, easy to
avoid). This is especially bad if you have low-resolution depth information
(e.g. with very far away objects). It's also inefficient with high depth
complexity because you're gonna spend a lot of time rendering objects that will
never be shown. Z-buffering also doesn't work well with transparency (naively).

## Binary Space Partition (BSP) Tree Depth Sort

Logically, a BSP is a data structure that allows us to efficiently ($O(n)$)
traverse in either far to near order (for hidden surface removal that respects
alpha) or near to far order (to limit overdraw). We will show a method of
constructing a BSP which is $O(n\log(n))$. Note that a BSP is completely
re-usable for any eye location in the set of objects.

To construct a binary space partition, choose an arbitrary polygon and make it
the root. Then split the space into polygons in front of the root and those
behind the root. If a polygon is on both sides then it must be split. The front
is one side of the tree and the back is the other. Then you recurse to those
subtrees.

*Note:* We can have heuristics that help us choose the root polygon to more
evenly split the space to be more efficient. Tho sometimes bad partitions are
inevitable. Consider for example a convex shape like a dodecahedron. No matter
what face you choose, all of the faces are on the other side.

Also, notice that this doesn't work in the naive way of repeating cubes. This
way is more efficient by respecting the geometry of the triangles.

To traverse a BSP, compare the eye to the root of the tree. Recurse towards the
side nearer (or farther) the eye, output the current root polygon, and then
recurse towards the side farther (or nearer) the eye.

**Pros:** Fast ($O(n)$) to traverse. Helps transparency and overdraw.

**Cons:** Slow ($O(n\log(n))$) to construct tree. Doesn't work well with
dynamic scenes. Also, poor choices of roots (e.g. creates lots of splits,
doesn't evenly split the area) yield poor performance.

# Displays

A **vector display** has no pixels. Instead, you have a stateful drawing head
which you move (either drawing or not) using vectors. These are also called
*random displays* since you can draw the display in any order. These predate
raster displays. A modern example of vector displays are EKGs, pen plotters,
and CNC routers.

A **raster display** has a regular scan that go over a regular array of pixels.
Although modern displays don't actually require a physical scan over their
pixels, we still do it for backwards compatibility reasons. Raster displays
have become the most common kind of display. Let's go over their pros and cons.

**Pros:**
* Raster displays allow the display update speed to be different than the image
  update speed (i.e. refresh rate != frame rate). This means your display won't
  flicker when drawing complex things.
* Raster displays are significantly faster than vector displays.
* Raster displays can fill in shapes easily, while vector displays can really
  only draw wireframes.
* Raster displays can have much more complex colors more easily. Vector
  displays struggle significantly to do color.

**Cons:**
* Raster displays have significant aliasing, especially with large pixels.

However, there are alternatives to both vector and raster displays. Most
alternatives focus on having lower latency than current displays, driven
primarily by video conferencing and virtual reality.

**Plasma displays** were invented in the 60s and most popular in the 80s and
90s. Their main benefit is they allow for **partial updates**, where you can
update only the parts of the screen that have updated, rather than having to
stream all the pixels all the time. They can do this because the display itself
"remembers" what was displayed. They fell out of favor because they suffered
from severe burn in, were expensive, and were generally outclassed by cheaper
LCD screens or higher quality OLED screens.

**High dynamic range (HDR) displays** are displays with a significantly larger
range of brightness, normally $5\mathrm{e}{-4}$ to $1\mathrm{e}{5}$ $cd/m^2$
instead of $5\mathrm{e}{-2}$ to $1\mathrm{e}{3}$ $cd/m^2$ (i.e. 4 more orders
of magnitude). These are becoming commercially available today.

**Near-eye light field displays** are displays which are meant to be
comfortable up close. Currently, virtual reality displays are fairly bulky in
part due to the large lenses that must go in front of the display for them to
be comfortable to look at. However, with near-eye light field displays, you can
have a display roughly 1cm thick right against your eye that is still
comfortable to look at. Nvidia has been doing research on this in particular.
These work by having a micro-lense array that cover a traditional OLED array
that presents several views of an image from slightly different angles. When
close to your eye, we perceive this as a single image.

Since the same image must be rendered from several different views, this
complicates rendering and makes rasterization in particular difficult. It also
significantly reduces the perceived spatial resolution because you're
essentially getting a smaller screen to render onto.

However, this does solve the *vergence-accommodation conflict* issue that
affects current VR. Vergence is about stereoscopy and accommodation is about
having one object (of your choice) in focus. So the conflict is where we have
stereoscopic information but cannot independently focus on objects in the
scene. This messes with our brain's depth sensing machinery and can cause
nausea or headaches in users of VR as well as inaccurate depth perception.

# Images

## Transparency

Normally, to describe colors we use **red-green-blue (RGB)**. However, this can
be enhanced with transparency into **red-green-blue-alpha (RGBA)**.

Suppose you have some fragment in front of an already colored buffer. To find
the new color given some transparency $\alpha$, you do
$$\text{color}_\text{new} = \alpha\text{color}_\text{new} + (1-\alpha)\text{color}_\text{buf}$$

Notice that with this formulation, order matters! This is good because it's
also what we'd naturally want.

Suppose you have a blue buffer $b$ with a red $r$ and green $g$ fragment both
with $\alpha = 0.5$. If you put red first $C_r$, then you get a redder color.
If you put green first $C_g$, then you get a greener color.
$$C_r = 0.5r + 0.5(0.5g + 0.5b) = 0.5r + 0.25g + 0.25b$$
$$C_g = 0.5g + 0.5(0.5r + 0.5b) = 0.5g + 0.25r + 0.25b$$

This complicates rasterization because then we must sort by depth. That is,
first you render all the opaque triangles with z-buffering. Then, render the
transparent triangles from back to front. While rendering the triangles, turn
off z-write and render the frontmost triangles (i.e. not occluded) without
updating the z-buffer values.

## Frame Buffer

Raster displays have a **frame buffer** which is the raw image data of the
image on the display. (This normally exists on the GPU.) To put images onto the
display, you have to write the image data to the frame buffer. The display then
displays out the content of the frame buffer while it is scanning.

This is part of what enables raster displays to separate display refresh rate
from frame (update) rate.

However, this has a flaw: **screen tearing**. When the frame buffer updates in
the middle of a display refresh, there are multiple frames being displayed at
the same time. This is unattractive, so we want some way to *synchronize*
display updates with frame buffer updates.

### Double Buffering / Vsync

The simplest way to do this through something called **double buffering** or
**vsync**. Here, you have two buffers: the **front buffer** and the **back
buffer**. The display only reads from the front buffer while the GPU reads from
the back buffer. Then, we do a buffer swap when the is done displaying the
front buffer (a so called **vertical sync** or **vsync**), we swap the buffers.

This method has one main issue: delay / latency. Your GPU has to wait for the
display to finish displaying the frame (a vsync) before rendering the next
frame.

We can mitigate this by **triple buffering**. In fact, you could go on and on
forever to attempt to reduce tearing! This results in smoother motion at
expense of increased latency.

### G-Sync / FreeSync

Another newer way to solve this issue is by flipping the relationship. That is,
the GPU tells the monitor when to do another scan rather than the monitor
telling the GPU when to render another frame. This results in no screen tearing
and also less latency than double-buffering.

This was initially developed by Nvidia under the name G-Sync but there is an
open alternative called FreeSync which was initially developed by AMD.

## Stenciling

**Stenciling** is a technique of clipping renders to only be inside a certain
area or *stencil*. This is most often useful for reflections in rasterization.

Suppose you are looking at an object over a large reflective disk. A common way
to render the reflection is by reflecting your viewport across the reflection
plane and rendering the object again.

However, naively this would result in the object being visible outside of just
the reflective disk. If we add a stencil of the shape of the reflective disk in
our eyesight and only render the reflection within that stencil, then we see
the reflection as desired.

This works by having a stencil buffer that you write into and check before
outputting/rendering the color.
