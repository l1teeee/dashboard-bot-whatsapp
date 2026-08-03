import { useState, useEffect } from 'react';
import { Copy, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Input, PageHeader, ErrorState } from '@/components/ui';
import { useAuthStore } from '@/store/auth';
import {
  getSettings,
  updateSettings,
  changePassword,
  getTeam,
  createInvitation,
  revokeInvitation,
  updateMemberStatus,
} from '@/api/auth';
import { fadeUp, staggerContainer } from '@/lib/motion';

export function SettingsPage() {
  const { account, tenant } = useAuthStore();
  const queryClient = useQueryClient();
  const isOwner = account?.role === 'owner';

  // Settings Query
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  });

  // Team Query
  const {
    data: team,
    isLoading: teamLoading,
    isError: teamError,
    error: teamErrorObj,
  } = useQuery({
    queryKey: ['team'],
    queryFn: getTeam,
    enabled: isOwner,
  });

  // Settings Mutation
  const settingsMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  // Password Mutation
  const passwordMutation = useMutation({
    mutationFn: changePassword,
  });

  // Invitation Mutation
  const invitationMutation = useMutation({
    mutationFn: createInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
    },
  });

  // Revoke Mutation
  const revokeMutation = useMutation({
    mutationFn: revokeInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
    },
  });

  // Member Status Mutation
  const memberStatusMutation = useMutation({
    mutationFn: (params: { id: number; status: 'active' | 'disabled' }) =>
      updateMemberStatus(params.id, { status: params.status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
    },
  });

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-7"
    >
      <motion.div variants={fadeUp}>
        <PageHeader
          kicker="Configuración"
          title="Ajustes del sistema"
          description={`Administra tu ${tenant?.name || 'restaurante'} y tu cuenta`}
        />
      </motion.div>

      {/* Restaurante Settings */}
      <motion.section
        variants={fadeUp}
        className="rounded-[30px] border border-border bg-surface p-6 neo-shadow sm:p-8"
      >
        <div className="mb-6">
          <p className="kicker text-yellow">Configuración</p>
          <h3 className="font-display text-3xl font-bold uppercase">
            Restaurante
          </h3>
        </div>

        <RestaurantForm
          settings={settings}
          loading={settingsMutation.isPending}
          onSubmit={(data) => settingsMutation.mutate(data)}
          isOwner={isOwner}
        />
      </motion.section>

      {/* Password Change */}
      <motion.section
        variants={fadeUp}
        className="rounded-[30px] border border-border bg-surface p-6 neo-shadow sm:p-8"
      >
        <div className="mb-6">
          <p className="kicker text-mint">Seguridad</p>
          <h3 className="font-display text-3xl font-bold uppercase">
            Cambiar contraseña
          </h3>
        </div>

        <PasswordForm
          loading={passwordMutation.isPending}
          onSubmit={(data) => passwordMutation.mutate(data)}
        />
      </motion.section>

      {/* Team Management */}
      {isOwner && (
        <>
          <motion.section
            variants={fadeUp}
            className="rounded-[30px] border border-border bg-surface p-6 neo-shadow sm:p-8"
          >
            <div className="mb-6">
              <p className="kicker text-coral">Equipo</p>
              <h3 className="font-display text-3xl font-bold uppercase">
                Miembros
              </h3>
            </div>

            {teamLoading && <p className="text-ink-soft">Cargando equipo...</p>}
            {teamError && (
              <ErrorState
                message={(teamErrorObj as any)?.message || 'Error al cargar el equipo'}
              />
            )}
            {team && <TeamMembersList members={team.members} mutation={memberStatusMutation} />}
          </motion.section>

          <motion.section
            variants={fadeUp}
            className="rounded-[30px] border border-border bg-surface p-6 neo-shadow sm:p-8"
          >
            <div className="mb-6">
              <p className="kicker text-yellow">Invitaciones</p>
              <h3 className="font-display text-3xl font-bold uppercase">
                Pendientes
              </h3>
            </div>

            {team && (
              <>
                <InvitationsList
                  invitations={team.invitations}
                  onRevoke={(id) => revokeMutation.mutate(id)}
                  revoking={revokeMutation.isPending}
                />

                <div className="mt-8 border-t border-border pt-8">
                  <h4 className="mb-4 font-bold uppercase">Invitar nuevo miembro</h4>
                  <InvitationForm
                    loading={invitationMutation.isPending}
                    onSubmit={(data) => invitationMutation.mutate(data)}
                  />
                </div>
              </>
            )}
          </motion.section>
        </>
      )}
    </motion.div>
  );
}

function RestaurantForm({
  settings,
  loading,
  onSubmit,
  isOwner,
}: {
  settings: any;
  loading: boolean;
  onSubmit: (data: any) => void;
  isOwner?: boolean;
}) {
  const [name, setName] = useState(settings?.name || '');
  const [menuLink, setMenuLink] = useState(settings?.menu_link || '');
  const [whatsappId, setWhatsappId] = useState(
    settings?.whatsapp_phone_number_id || ''
  );
  const [whatsappToken, setWhatsappToken] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setName(settings.name || '');
      setMenuLink(settings.menu_link || '');
      setWhatsappId(settings.whatsapp_phone_number_id || '');
    }
  }, [settings]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const data: any = {
      name: name.trim(),
      menu_link: menuLink.trim() || undefined,
      whatsapp_phone_number_id: whatsappId.trim() || undefined,
    };

    if (whatsappToken.trim()) {
      data.whatsapp_access_token = whatsappToken.trim();
    }

    try {
      onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    }
  }

  if (!isOwner) {
    return (
      <div className="space-y-4 text-sm">
        <div>
          <p className="text-xs font-bold uppercase text-ink-soft">Nombre</p>
          <p className="mt-2 font-bold">{settings?.name}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-ink-soft">Link del menú</p>
          <p className="mt-2 text-ink-soft">
            {settings?.menu_link || 'No configurado'}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-ink-soft">
            WhatsApp Phone ID
          </p>
          <p className="mt-2 text-ink-soft">
            {settings?.whatsapp_phone_number_id || 'No configurado'}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-ink-soft">
            WhatsApp Token
          </p>
          <p className="mt-2 text-ink-soft">
            {settings?.whatsapp_token_configured ? 'Configurado' : 'No configurado'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <Input
        type="text"
        label="Nombre del restaurante"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={loading}
      />

      <Input
        type="url"
        label="Link del menú"
        placeholder="https://example.com/menu"
        value={menuLink}
        onChange={(e) => setMenuLink(e.target.value)}
        disabled={loading}
      />

      <Input
        type="text"
        label="WhatsApp Phone Number ID"
        value={whatsappId}
        onChange={(e) => setWhatsappId(e.target.value)}
        disabled={loading}
      />

      <Input
        type="password"
        label={`WhatsApp Access Token${settings?.whatsapp_token_configured ? ' (dejar vacío para no cambiar)' : ''}`}
        placeholder={settings?.whatsapp_token_configured ? 'Configurado' : 'Tu token'}
        value={whatsappToken}
        onChange={(e) => setWhatsappToken(e.target.value)}
        disabled={loading}
      />

      {error && <p className="text-sm text-coral">{error}</p>}

      <Button type="submit" variant="secondary" isLoading={loading}>
        Guardar cambios
      </Button>
    </form>
  );
}

function PasswordForm({
  loading,
  onSubmit,
}: {
  loading: boolean;
  onSubmit: (data: any) => void;
}) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!currentPassword.trim() || !newPassword.trim()) {
      setError('Completa todos los campos.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (newPassword.length < 10) {
      setError('La nueva contraseña debe tener al menos 10 caracteres.');
      return;
    }

    try {
      onSubmit({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar contraseña');
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="relative">
        <Input
          type={showCurrentPassword ? 'text' : 'password'}
          label="Contraseña actual"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          disabled={loading}
          className="pr-14"
        />
        <button
          type="button"
          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          className="absolute right-3 top-8 text-ink-soft hover:text-ink"
          aria-label={
            showCurrentPassword ? 'Ocultar' : 'Mostrar'
          }
        >
          {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      <div className="relative">
        <Input
          type={showNewPassword ? 'text' : 'password'}
          label="Nueva contraseña (mínimo 10 caracteres)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={loading}
          className="pr-14"
        />
        <button
          type="button"
          onClick={() => setShowNewPassword(!showNewPassword)}
          className="absolute right-3 top-8 text-ink-soft hover:text-ink"
          aria-label={
            showNewPassword ? 'Ocultar' : 'Mostrar'
          }
        >
          {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      <Input
        type="password"
        label="Confirmar nueva contraseña"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        disabled={loading}
      />

      {error && <p className="text-sm text-coral">{error}</p>}
      {success && (
        <p className="text-sm text-mint">Contraseña cambiada exitosamente.</p>
      )}

      <Button type="submit" variant="secondary" isLoading={loading}>
        Cambiar contraseña
      </Button>
    </form>
  );
}

function TeamMembersList({
  members,
  mutation,
}: {
  members: any[];
  mutation: any;
}) {
  return (
    <div className="space-y-3">
      {members.map((member) => (
        <div
          key={member.id}
          className="flex items-center justify-between rounded-lg border border-border bg-shell p-4"
        >
          <div>
            <p className="font-bold">{member.name}</p>
            <p className="text-sm text-ink-soft">{member.email}</p>
            <p className="text-xs uppercase text-ink-soft">
              {member.role === 'owner' ? 'Propietario' : 'Personal'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={member.status === 'active' ? 'secondary' : 'danger'}
              onClick={() =>
                mutation.mutate({
                  id: member.id,
                  status: member.status === 'active' ? 'disabled' : 'active',
                } as { id: number; status: 'active' | 'disabled' })
              }
              isLoading={mutation.isPending}
            >
              {member.status === 'active' ? 'Activo' : 'Deshabilitado'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function InvitationsList({
  invitations,
  onRevoke,
  revoking,
}: {
  invitations: any[];
  onRevoke: (id: number) => void;
  revoking: boolean;
}) {
  const [copied, setCopied] = useState<number | null>(null);

  if (invitations.length === 0) {
    return <p className="text-sm text-ink-soft">No hay invitaciones pendientes.</p>;
  }

  return (
    <div className="space-y-3">
      {invitations.map((inv) => (
        <div
          key={inv.id}
          className="flex items-center justify-between rounded-lg border border-border bg-shell p-4"
        >
          <div className="min-w-0 flex-1">
            <p className="font-bold">{inv.email}</p>
            <p className="text-xs uppercase text-ink-soft">
              {inv.role === 'owner' ? 'Propietario' : 'Personal'}
            </p>
            <p className="mt-2 break-all rounded bg-surface-raised px-2 py-1 text-xs font-mono text-ink-soft">
              {inv.invite_url}
            </p>
          </div>
          <div className="ml-4 flex gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(inv.invite_url);
                setCopied(inv.id);
                setTimeout(() => setCopied(null), 2000);
              }}
              className="rounded p-2 hover:bg-surface"
              aria-label="Copiar enlace"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={() => onRevoke(inv.id)}
              disabled={revoking}
              className="rounded p-2 hover:bg-surface"
              aria-label="Revocar invitación"
            >
              <Trash2 className="h-4 w-4 text-coral" />
            </button>
          </div>
          {copied === inv.id && (
            <span className="text-xs text-mint">Copiado</span>
          )}
        </div>
      ))}
    </div>
  );
}

function InvitationForm({
  loading,
  onSubmit,
}: {
  loading: boolean;
  onSubmit: (data: any) => void;
}) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'owner' | 'staff'>('staff');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Ingresa un email.');
      return;
    }

    try {
      onSubmit({ email: email.trim(), role });
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear invitación');
    }
  }

  return (
    <form className="flex flex-col gap-4 sm:flex-row sm:items-end" onSubmit={handleSubmit}>
      <div className="flex-1">
        <Input
          type="email"
          label="Email del nuevo miembro"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
      </div>

      <select
        value={role}
        onChange={(e) => setRole(e.target.value as 'owner' | 'staff')}
        disabled={loading}
        className="rounded-lg border border-border bg-shell px-3 py-2 font-bold text-ink"
      >
        <option value="staff">Personal</option>
        <option value="owner">Propietario</option>
      </select>

      <Button
        type="submit"
        variant="secondary"
        isLoading={loading}
        className="sm:w-auto"
      >
        <Plus className="h-4 w-4" />
        Invitar
      </Button>

      {error && <p className="text-sm text-coral">{error}</p>}
    </form>
  );
}
