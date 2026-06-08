-- AddForeignKey
ALTER TABLE "Invitations" ADD CONSTRAINT "Invitations_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
