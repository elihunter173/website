+++
title = "PY 205: Physics I (Mechanics & Energy)"
[extra]
teacher = "Dr. Kory Green"
+++

Sadly I did not scan in my paper notes for this class, so all I have is this
small cheatsheet.

# Units

## Fundamental Units

| Dimension    | Symbol          | SI Unit                                |
|--------------|:---------------:|----------------------------------------|
| Length       | $L$             | meter ($m$)                            |
| Mass         | $M$             | kilogram ($kg$)                        |
| Time         | $T$             | second ($s$)                           |

## Derived Units

| Dimension    | SI Unit                                |
|--------------|----------------------------------------|
| Area         | square meter ($m^2$)                   |
| Volume       | cubic meter ($m^3$)                    |
| Velocity     | meters per second ($m/s$)              |
| Acceleration | meters per second per second ($m/s^2$) |
| Force        | Newtons or ($N = kg \cdot m/s^2$)      |
| Pressure     | Newtons per meter ($N/m = kg/s^2$)     |

## SI Prefixes

| Prefix         | $10^n$ |
|----------------|:------:|
| tera- ($T$)    | 12     |
| giga- ($G$)    | 9      |
| mega- ($M$)    | 6      |
| kilo- ($k$)    | 3      |
| centi- ($c$)   | -2     |
| milli- ($m$)   | -3     |
| micro- ($\mu$) | -6     |
| nano- ($n$)    | -9     |
| pico- ($p$)    | -12    |
| fempto- ($f$)  | -15    |

# Kinematics

| Symbol     | Property     | SI Units |
|:----------:|--------------|:--------:|
| $x$ or $y$ | Position     | $m$      |
| $v$        | Velocity     | $m/s$    |
| $a$        | Acceleration | $m/s^2$  |
| $t$        | Time         | $s$      |

## Equations

* $v_f = v_i + at$
* $x_f = x_i + v_it + \frac{1}{2}at^2$
* $\bar{v} = \frac{v_f + v_i}{2}$
* $x_f = x_i + (\frac{v_{x,f} + v_{x,i}}{2})t$
* $v_f^2 = v_i^2 + 2a(x_f - x_i)$

## Constants

* $g_{earth} = 9.80 m/s^2$

# Rotation

## Variables

| Symbol      | Property                                | SI Units       |
|:-----------:|-----------------------------------------|:--------------:|
| $\theta$    | Angle/Angular Position                  | $rad$          |
| $\omega$    | Angular speed                           | $rad/s$        |
| $\alpha$    | Angular acceleration                    | $rad/s^2$      |
| $\tau$      | Torque (angular force)                  | $N \cdot m$    |
| $I$         | Moment of inertia                       | $kg \cdot m^2$ |
| $r$         | Radius                                  | $m$            |
| $T$         | Period                                  | $s$            |
| $F$         | Frequency                               | $1/s$ or $Hz$  |
| $v$         | Linear velocity                         | $m/s$          |
| $a_c = a_r$ | Centripetal/center-seeking acceleration | $m/s^2$        |
| $a_t$       | Tangential acceleration                 | $m/s^2$        |

## Equations

* $\omega = \frac{2\pi}{T}$
* $v = \frac{2 \pi r}{T}$
* $a_c = \frac{v^2}{r}$
* $T = \frac{2 \pi r}{v}$
* $F = \frac{1}{T}$
* $\tau = I \alpha$
* $I = I_{CM} + MD^2$ (Parallel Axis Theorem)
* $\omega_f = \omega_i + at$
* $\theta_f = \theta_i + \omega_i t + \frac{1}{2}\alpha t^2$
* $\bar{\omega} = \frac{\omega_f + \omega_i}{2}$
* $\theta_f = \theta_i + (\frac{\omega_{f} + \omega_{i}}{2})t$
* $\omega_f^2 = \omega_i^2 + 2\alpha (\theta_f - \theta_i)$

### Common Moments of Inertia

| Shape                  | Equation                                                          |
|------------------------|:-----------------------------------------------------------------:|
| Point                  | $I = MR^2$                                                        |
| Rod attached in middle | $I = \frac{1}{12}MR^2$                                            |
| Rod attached on end    | $I = \frac{1}{3}MR^2$                                             |
| Thin circular hoop     | $I_{\perp} = MR^2$ and $I_{\parallel} = \frac{1}{2}MR^2$            |
| Thin solid disk        | $I_{\perp} = \frac{1}{2}MR^2$ and $I_{\parallel} = \frac{1}{4}MR^2$ |
| Hollow sphere          | $I = \frac{2}{3}MR^2$                                             |
| Solid sphere           | $I = \frac{2}{5}MR^2$                                             |

## Vocab

* Lever/Moment Arm: The perpendicular distance between the axis of rotation and the application of
  force.
  * AKA: The part that matters.

# Newtonian Physics

## Principles

* Archimedes' Principle (for buoyancy): The buoyant force is the weight of the fluid displaced.

## Laws

1. $\sum{\vec{F}} = 0 \Longrightarrow \vec{a} = 0$
2. $\sum{\vec{F}} = m\vec{a} = \frac{d}{dt}(m\vec{v})$
3. Equal and opposite reaction.

## Types of Forces

* **Contact:** Objects must be touching to have an effect
  * Normal/Flex: Perpendicular to plane, prevents clipping.
  * Tension: From rope or rope-like objects.
  * Friction: Opposes motion of body against another.
  * Spring: Seeks equilibrium in springs.
  * Buoyant: Pushes things with/against gravity depending on density.
* **Field:** Acts even without touching.
  * Gravitational: Pull all material objects together.
  * Electromagnetic: Pull/push magnetic things.

## Equations for Forces

| Force Type | Equation                             | Note                                                  |
|------------|--------------------------------------|-------------------------------------------------------|
| Weight     | $W = mg = m * \frac{GM_{body}}{r^2}$ | Assumes uniform gravitational field.                  |
| Normal     | $N = F_{\perp_{inside}}$             | The force that prevents two bodies from intersecting. |
| Spring     | $F_{sp} = -kx$                       | $k$ is the unique spring constant.                    |
| Buoyant    | $B = \rho_{fluid}gV_{disp}$          | For fully submerged bodies, $V_{disp} = V_{obj}$.     |

# Energy

## Vocabulary

* Energy: The ability to do work.
* Work: A measure of change of state and its associated difficulty in a system.

## Principles

* Energy in a system is constant unless is receives some work external to the system or does some
  work external to the system.

## Variables

| Symbol      | Property                                | SI Units      |
|:-----------:|-----------------------------------------|:-------------:|
| $E$         | Energy                                  | $J$           |
| $W$         | Work / Change in Energy                 | $J$           |
| $P$         | Power / Rate of Change in Energy        | $J/s$ or $W$  |
| $U$         | Potential Energy                        | $J$           |
| $U_g$       | Gravitational Potential Energy          | $J$           |
| $U_{sp}$    | Spring Potential Energy                 | $J$           |
| $KE$        | Kinetic Energy                          | $J$           |

## Equations

* $E = \vec{F} \cdot \vec{r}$
* $E_f = E_i + W$
* $W_f = \int\!f\,\mathrm{d}r$

### Energy Equations

| Energy Type                            | Equations              | Notes                               |
|----------------------------------------|:----------------------:|-------------------------------------|
| Potential Spring Energy ($U_s$)        | $\frac{1}{2}kx^2$      |                                     |
| Potential Gravitational Energy ($U_g$) | $mgh$                  | Assumes uniform gravitational field |
| Translational Kinetic Energy ($KE$)    | $\frac{1}{2}mv^2$      |                                     |
| Rotational Kinetic Energy ($KE$)       | $\frac{1}{2}I\omega^2$ |                                     |
