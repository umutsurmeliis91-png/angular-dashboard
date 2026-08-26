import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { User } from '../../../core/auth/auth.models';
import { USER_ROLES } from '../../../shared/models/user.models';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-users',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    TagModule,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {
  private readonly fb = inject(FormBuilder);
  private readonly usersService = inject(UsersService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  readonly roleOptions = USER_ROLES;

  readonly users = this.usersService.users;
  readonly loading = signal(true);
  readonly saving = signal(false);

  readonly searchTerm = signal('');
  readonly filteredUsers = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return this.users();
    }

    return this.users().filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.username.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term),
    );
  });

  readonly dialogVisible = signal(false);
  readonly editingUser = signal<User | null>(null);

  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    role: ['USER', [Validators.required]],
  });

  constructor() {
    this.usersService.getUsers().subscribe(() => this.loading.set(false));
  }

  openCreateDialog(): void {
    this.editingUser.set(null);
    this.form.reset({ username: '', name: '', email: '', role: 'USER' });
    this.dialogVisible.set(true);
  }

  openEditDialog(user: User): void {
    this.editingUser.set(user);
    this.form.reset({
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.roles[0] ?? 'USER',
    });
    this.dialogVisible.set(true);
  }

  closeDialog(): void {
    this.dialogVisible.set(false);
  }

  submit(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const value = this.form.getRawValue();
    const editing = this.editingUser();
    const request = editing
      ? this.usersService.updateUser(editing.id, value)
      : this.usersService.createUser(value);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.messageService.add({
          severity: 'success',
          summary: editing ? 'Kullanıcı güncellendi' : 'Kullanıcı oluşturuldu',
          detail: `${value.name} başarıyla ${editing ? 'güncellendi' : 'eklendi'}.`,
          life: 2500,
        });
      },
      error: (error: Error) => {
        this.saving.set(false);
        this.messageService.add({ severity: 'error', summary: 'Hata', detail: error.message, life: 3000 });
      },
    });
  }

  confirmDelete(user: User): void {
    this.confirmationService.confirm({
      header: 'Kullanıcıyı sil',
      message: `${user.name} adlı kullanıcıyı silmek istediğinize emin misiniz?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sil',
      rejectLabel: 'Vazgeç',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
      accept: () => this.deleteUser(user),
    });
  }

  roleSeverity(role: string): 'danger' | 'warn' | 'info' {
    switch (role) {
      case 'ADMIN':
        return 'danger';
      case 'EDITOR':
        return 'warn';
      default:
        return 'info';
    }
  }

  private deleteUser(user: User): void {
    this.usersService.deleteUser(user.id).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Kullanıcı silindi',
        detail: `${user.name} silindi.`,
        life: 2500,
      });
    });
  }
}
