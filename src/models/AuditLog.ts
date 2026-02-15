import mongoose from "mongoose";

export interface IAuditLog {
  _id?: string;
  adminId: string;
  action: string;
  entity: string;
  entityId?: string;
  changes?: Record<string, any>;
  createdAt?: Date;
}

const AuditLogSchema = new mongoose.Schema<IAuditLog>(
  {
    adminId: { type: String, required: true },
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: { type: String },
    changes: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const AuditLog = mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
