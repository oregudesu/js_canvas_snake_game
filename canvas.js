const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c = canvas.getContext("2d");


const FIELD_OBJECTS = {
    EMPTY: 0,
    SNAKE_BODY: 1,
    SNAKE_HEAD: 2,
    APPLE: 3,
    AMANITA: 4
}

function FieldCell(x, y, w, thickness) {
    // w - this is a width and height of a cell in px
    this.x = x;
    this.y = y;
    this.w = w;
    this.thickness = thickness;
    this.brightness = 235;
    this.snake_padding = 4;
    this.objects_padding = 2;

    this.draw_snake_head = () => {
        c.beginPath();
        c.fillStyle = "black";
        c.rect(this.x + this.snake_padding, this.y + this.snake_padding, this.w - (2 * this.snake_padding), this.w - (2 * this.snake_padding));
        c.fill();
    };

    this.draw_snake_body = () => {
        c.beginPath();
        c.fillStyle = "green";
        c.rect(this.x + this.snake_padding, this.y + this.snake_padding, this.w - (2 * this.snake_padding), this.w - (2 * this.snake_padding));
        c.fill();
    };

    this.draw_apple = () => {
        c.beginPath();
        c.fillStyle = "red";
        c.arc(this.x + this.objects_padding + (this.w - (2 * this.objects_padding)) / 2, this.y + this.objects_padding + (this.w - (2 * this.objects_padding)) / 2, (this.w - (2 * this.objects_padding)) / 2, 0, 2 * Math.PI, false);
        c.fill();
        c.beginPath();
        c.fillStyle = "black";
        c.arc(
            this.x + this.objects_padding + (this.w - (2 * this.objects_padding)) / 2,
            this.y + this.objects_padding + (this.w - (2 * this.objects_padding)) / 2 + this.w / 4,
            (this.w - (2 * this.objects_padding)) / 20,
            0,
            2 * Math.PI,
            false
        );
        c.fill();
        c.beginPath();
        c.strokeStyle = "darkgreen";
        c.moveTo(
            this.x + this.objects_padding + (this.w - (2 * this.objects_padding)) / 2,
            this.y + this.objects_padding * 1.5
        );
        c.lineTo(
            this.x + this.objects_padding + (this.w - (2 * this.objects_padding)) / 4,
            this.y + this.objects_padding
        );
        c.stroke();
    };

    this.draw_amanita = () => {
        let spot_radius = this.w / 20;

        c.beginPath();
        c.strokeStyle = "black";
        c.ellipse(
            x = this.x + this.w / 2 + this.objects_padding / 2,
            y = this.y + this.w / 2 + this.objects_padding / 2,
            radiusX = (this.w - (2 * this.objects_padding)) / 2,
            radiusY = (this.w - (2 * this.objects_padding)) / 4,
            rotation = Math.PI / 2,
            startAngle = 0,
            endAngle = 2 * Math.PI
        );
        c.stroke();
        c.beginPath();
        c.fillStyle = "red";
        c.arc(
            x = this.x + this.w / 2 + this.objects_padding / 2,
            y = this.y + this.w / 2 + this.objects_padding / 2,
            radius = (this.w - (2 * this.objects_padding)) / 2,
            startAngle = 0,
            endAngle = Math.PI,
            couterclockwise = true
        );
        c.fill();
        c.lineTo(
            x = this.x + this.w / 2 + this.objects_padding / 2 + (this.w - (2 * this.objects_padding)) / 2,
            y = this.y + this.w / 2 + this.objects_padding / 2
        );
        c.stroke();

        c.strokeStyle = "white";
        c.fillStyle = "white";

        c.beginPath();
        c.arc(
            x = this.x + this.objects_padding / 2 + this.w / 4,
            y = this.y + this.objects_padding / 2 + this.w / 4,
            radius = spot_radius,
            startAngle = 0,
            endAngle = 2 * Math.PI,
            couterclockwise = false
        );
        c.stroke();
        c.fill();

        c.beginPath();
        c.arc(
            x = this.x + this.objects_padding / 2 + this.w / 2.25,
            y = this.y + this.objects_padding / 2 + this.w / 2.75,
            radius = spot_radius,
            startAngle = 0,
            endAngle = 2 * Math.PI,
            couterclockwise = false
        );
        c.stroke();
        c.fill();

        c.beginPath();
        c.arc(
            x = this.x + this.objects_padding / 2 + this.w / 1.5,
            y = this.y + this.objects_padding / 2 + this.w / 3.2,
            radius = spot_radius,
            startAngle = 0,
            endAngle = 2 * Math.PI,
            couterclockwise = false
        );
        c.stroke();
        c.fill();
    };

    this.clear = () => {
        c.clearRect(this.x + 1, this.y + 1, this.w - 1, this.w - 1);
    };

    this.draw = (fill) => {
        this.clear();
        c.beginPath();
        c.strokeStyle = `rgb(${this.brightness}, ${this.brightness}, ${this.brightness})`;
        c.lineWidth = this.thickness;
        c.rect(this.x, this.y, this.w + this.thickness, this.w + this.thickness);
        c.stroke();

        if (fill) {
            if (fill == FIELD_OBJECTS.SNAKE_BODY) {
                this.draw_snake_body();
            } else if (fill == FIELD_OBJECTS.SNAKE_HEAD) {
                this.draw_snake_head();
            } else if (fill == FIELD_OBJECTS.APPLE) {
                this.draw_apple();
            } else if (fill == FIELD_OBJECTS.AMANITA) {
                this.draw_amanita();
            }
        }

    };
}

function Field(x, y, w, h) {
    // w and h - these are numbers of cells horizontally and vertically
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.snake = new Snake();
    this.cells = new Array(this.w);
    this.cell_width = 20;
    this.cell_thickness = 1;
    this.inside_paddings = {
        top: 70,
        left: 30,
        down: 30,
        right: 70
    };

    for (let i = 0; i < this.w; i++) {
        this.cells[i] = new Array(this.h);
    }

    this.draw_snake_length_header = () => {
        c.font = "40px serif";
        c.fillStyle = "rgb(10, 10, 10)";
        c.fillText(
            text = "Snake length: ",
            x = this.x + this.inside_paddings.left,
            y = this.y / 4 + this.inside_paddings.top
        );
    };

    this.draw_interface = () => {
        this.clear_area(
            x = this.x + (this.w * (this.cell_width + this.cell_thickness) + this.inside_paddings.left + this.inside_paddings.right) / 2,
            y = this.y + this.inside_paddings.top / 3,
            w = (this.w * (this.cell_width + this.cell_thickness) + this.inside_paddings.left + this.inside_paddings.right) / 4,
            h = 40
        );

        c.beginPath();
        c.strokeStyle = "rgb(10, 10, 10)";
        c.rect(
            this.x + 1,
            this.y + 1,
            this.w * (this.cell_width + this.cell_thickness) + this.inside_paddings.left + this.inside_paddings.right,
            this.h * (this.cell_width + this.cell_thickness) + this.inside_paddings.top + this.inside_paddings.down
        )
        c.stroke();

        c.beginPath();
        c.strokeStyle = "rgb(10, 10, 10)";
        c.rect(
            this.x + this.inside_paddings.left,
            this.y + this.inside_paddings.top,
            this.w * (this.cell_width + this.cell_thickness),
            this.h * (this.cell_width + this.cell_thickness)
        );
        c.stroke();

        c.font = "40px serif";
        c.fillStyle = "rgb(10, 10, 10)";
        c.fillText(
            text = this.snake.get_length().toString(),
            x = this.x + (this.w * (this.cell_width + this.cell_thickness) + this.inside_paddings.left + this.inside_paddings.right) / 2,
            y = this.y / 4 + this.inside_paddings.top
        );
    }

    this.draw_grid = () => {
        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {
                x = this.x + (this.cell_width + this.cell_thickness) * i + this.inside_paddings.left;
                y = this.y + (this.cell_width + this.cell_thickness) * j + this.inside_paddings.top;
                const cell = new FieldCell(x, y, this.cell_width, this.cell_thickness)
                cell.draw();
                this.cells[i][j] = cell;
            }
        }
    }

    this.draw_snake = () => {
        for (let i = 0; i < this.snake.body.length; i++) {
            if (i == 0) {
                this.cells[this.snake.body[i].x][this.snake.body[i].y].draw_snake_head();
            } else {
                this.cells[this.snake.body[i].x][this.snake.body[i].y].draw_snake_body();
            }
        }
    };

    this.draw = () => {
        this.draw_grid();
        this.draw_interface();
        this.draw_snake_length_header();
    }

    this.clear_cell = (x, y) => {
        this.cells[x][y].clear();
    };

    this.clear_cells = (array) => {
        for (let i = 0; i < array.length; i++) {
            this.clear_cell(array[i].x, array[i].y);
        }
    };

    this.clear_area = (x, y, w, h) => {
        c.clearRect(x, y, w, h);
    };
}

function Snake() {
    this.body = [];
    this.direction = {
        x: 1,
        y: 0
    };

    this.get_length = () => {
        return this.body.length;
    };

    this.get_head = () => {
        return (this.get_length() > 0) ? this.body[0] : undefined;
    };

    this.get_tail = () => {
        return (this.get_length() > 0) ? this.body[this.get_length() - 1] : undefined;
    };

    this.get_cut_index = () => {
        const part = this.body.findIndex((e, index) => index !== 0 && e.x === this.get_head().x && e.y === this.get_head().y);
        return part;
    };
}


function Game() {
    this.field = null;
    this.map = null;
    this.snake = null;
    this.initial_snake_length = 3;
    this.initial_snake_position = {
        x: 10,
        y: 10
    };
    this.apple_count = 0;
    this.max_apple_count = 1;
    this.amanitas = [];
    this.max_amanita_count = 10;
    this.is_unlocked = false;

    this.init = () => {
        this.field = new Field(30, 20, 20, 20);
        this.field.draw();

        this.snake = this.field.snake;

        this.map = new Array(this.field.h);
        for (let i = 0; i < this.field.w; i++) {
            this.map[i] = new Array(this.field.h).fill(0);
        }

        for (let i = 0; i < this.initial_snake_length; i++) {
            let x = this.initial_snake_position.x - this.snake.direction.x * i;
            let y = this.initial_snake_position.y - this.snake.direction.y * i;
            this.snake.body.push({ x, y });
            this.map[x][y] = (i == 0) ? FIELD_OBJECTS.SNAKE_HEAD : FIELD_OBJECTS.SNAKE_BODY;
        }

        this.field.draw_snake();

        // register keys
        document.addEventListener("keyup", (event) => {
            if (event.keyCode === 37) {
                // left
                if (this.snake.direction.x !== 1 && this.is_unlocked) {
                    this.snake.direction.x = -1;
                    this.snake.direction.y = 0;
                    this.is_unlocked = false;
                }
                // console.log("left");
            } else if (event.keyCode == 38) {
                // up
                if (this.snake.direction.y !== 1 && this.is_unlocked) {
                    this.snake.direction.x = 0;
                    this.snake.direction.y = -1;
                    this.is_unlocked = false;
                }
                // console.log("up");
            } else if (event.keyCode == 39) {
                // right
                if (this.snake.direction.x !== -1 && this.is_unlocked) {
                    this.snake.direction.x = 1;
                    this.snake.direction.y = 0;
                    this.is_unlocked = false;
                }
                // console.log("right");
            } else if (event.keyCode == 40) {
                // down
                if (this.snake.direction.y !== -1 && this.is_unlocked) {
                    this.snake.direction.x = 0;
                    this.snake.direction.y = 1;
                    this.is_unlocked = false;
                }
                // console.log("down");
            }
        });
    };

    this.print_map = () => {
        for (let i = 0; i < this.map.length; i++) {
            let s = "";
            for (let j = 0; j < this.map[i].length; j++) {
                s += this.map[j][i] + " ";
            }
            console.log(s + "\n");
        }
    };

    this.get_position = (x, y) => {
        let value;
        if (x === 0 || x) {
            value = (x < 0) ? this.field.w - 1 : (x > this.field.w - 1) ? 0 : x;
        } else if (y === 0 || y) {
            value = (y < 0) ? this.field.h - 1 : (y > this.field.h - 1) ? 0 : y;
        }
        return value;
    };

    this.move_snake = () => {
        // draw a body element in head position
        this.map[this.snake.get_head().x][this.snake.get_head().y] = FIELD_OBJECTS.SNAKE_BODY;
        this.field.clear_cell(this.snake.get_tail().x, this.snake.get_tail().y);

        this.snake.body.unshift({
            x: this.get_position(x = this.snake.get_head().x + this.snake.direction.x),
            y: this.get_position(y = this.snake.get_head().y + this.snake.direction.y)
        });

        const is_apple = this.map[this.snake.get_head().x][this.snake.get_head().y] == FIELD_OBJECTS.APPLE;
        const is_body = this.map[this.snake.get_head().x][this.snake.get_head().y] == FIELD_OBJECTS.SNAKE_BODY;
        const is_amanita = this.map[this.snake.get_head().x][this.snake.get_head().y] == FIELD_OBJECTS.AMANITA;

        if (!is_apple) {
            // remove a tail position
            this.map[this.snake.get_tail().x][this.snake.get_tail().y] = FIELD_OBJECTS.EMPTY;
            this.snake.body.pop();
        }
        if (is_apple) {
            this.field.clear_cell(this.snake.get_head().x, this.snake.get_head().y);
            this.apple_count--;
        } else if (is_body) {
            const index = this.snake.get_cut_index();
            const parts_to_remove = this.snake.body.slice(index - 1);
            this.field.clear_cells(parts_to_remove);
            this.snake.body = this.snake.body.slice(0, index);
        } else if (is_amanita) {
            this.field.clear_cell(this.snake.get_head().x, this.snake.get_head().y);
            let index = this.snake.get_length() - 2;
            const parts_to_remove = this.snake.body.slice(index);
            this.field.clear_cells(parts_to_remove);
            this.snake.body = this.snake.body.slice(0, index);
            index = this.amanitas.findIndex(e => e.x === this.snake.get_head().x && e.y === this.snake.get_head().y);
            this.amanitas.splice(index, 1);
        }

        this.map[this.snake.get_head().x][this.snake.get_head().y] = FIELD_OBJECTS.SNAKE_HEAD;
        this.field.draw_snake();
    };

    this.generate_apple = () => {
        if (this.apple_count < this.max_apple_count && Math.random() >= 0.75) {
            let random_x = Math.floor(Math.random() * (this.field.w - 1));
            let random_y = Math.floor(Math.random() * (this.field.h - 1));
            if (this.map[random_x][random_y] === FIELD_OBJECTS.EMPTY &&
                this.map[random_x - this.snake.direction.x][random_y - this.snake.direction.y] !== FIELD_OBJECTS.SNAKE_HEAD) {
                this.map[random_x][random_y] = FIELD_OBJECTS.APPLE;
                this.field.cells[random_x][random_y].draw_apple();
                this.apple_count++;
            }
        }
    };

    this.update_amanitas = () => {
        const to_remove = [];
        // check all amanitas
        for (let i = 0; i < this.amanitas.length; i++) {
            this.amanitas[i].time++;
            // remove amanita after 10 sec living and with 50% chance
            if (this.amanitas[i].time >= 30 && Math.random() >= 0.5) {
                to_remove.push(i);
                this.field.clear_cell(this.amanitas[i].x, this.amanitas[i].y);
                this.map[this.amanitas[i].x][this.amanitas[i].y] = FIELD_OBJECTS.EMPTY;
            }
        }

        for (let i = 0; i < to_remove.length; i++) {
            this.amanitas.splice(to_remove[i], to_remove[i] + 1);
        }

        // generate new amanita
        if (this.amanitas.length < this.max_amanita_count && Math.random() > 0.75) {
            let random_x = Math.floor(Math.random() * (this.field.w - 1));
            let random_y = Math.floor(Math.random() * (this.field.h - 1));
            if (this.map[random_x][random_y] === FIELD_OBJECTS.EMPTY &&
                this.map[this.get_position(x = random_x - this.snake.direction.x)][this.get_position(y = random_y - this.snake.direction.y)] !== FIELD_OBJECTS.SNAKE_HEAD) {
                const amanita = {
                    x: random_x,
                    y: random_y,
                    time: 0,
                };
                this.amanitas.push(amanita);
                this.map[amanita.x][amanita.y] = FIELD_OBJECTS.AMANITA;
                this.field.cells[amanita.x][amanita.y].draw_amanita();
            }
        }
    };

    this.update = () => {
        this.move_snake();
        this.generate_apple();
        this.update_amanitas();
        this.is_unlocked = true;
        this.field.draw_interface();
    };

}

const game = new Game();
game.init();

function animate() {
    game.update();
    setTimeout(() => requestAnimationFrame(animate), 250);
}
// animate();